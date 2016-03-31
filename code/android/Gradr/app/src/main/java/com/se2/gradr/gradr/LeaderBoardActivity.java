package com.se2.gradr.gradr;

import android.content.Context;
import android.content.Intent;
import android.os.AsyncTask;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.ListView;
import android.widget.TextView;

import com.se2.gradr.gradr.helpers.GetRequester;
import com.se2.gradr.gradr.helpers.JsonConverter;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;

public class LeaderBoardActivity extends AppCompatActivity {

    private int userId;
    private String username;

    private ListView leaderBoard;
    private ArrayList<LeaderBoardEntry> leaders = null;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        ThemeSelector.onActivityChangeTheme(this);
        setContentView(R.layout.leader_board_activity);

        //The only reason we need this info here is because we want to be able to pass it on
        //if someone were to click one of the menu options.
        Intent starter = getIntent();
        userId = starter.getIntExtra("id", -1);
        username = starter.getStringExtra("username");
        if (username == null || username.length() < 1 || userId < 0) {
            finish(); //Go back, we won't allow access to anything without both of these
        }

        leaders = new ArrayList<LeaderBoardEntry>();
        new GetMatchesTask().execute();

        leaderBoard = (ListView) findViewById(R.id.leaders_list_view);
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.main_menu, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();


        if (id == R.id.action_logout) {
            Intent logoutIntent = new Intent(this, LoginActivity.class);
            logoutIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
            startActivity(logoutIntent);
        } else if (id == R.id.action_matches) {
            Intent matchesIntent = new Intent(this, StudentListActivity.class);
            matchesIntent.putExtra("username", username);
            matchesIntent.putExtra("id", userId);
            startActivity(matchesIntent);
        } else if (id == R.id.action_theme) {
            ThemeSelector.showThemeDialog(this);
        } else if (id == R.id.action_profile) {
            Intent profileIntent = new Intent(this, ProfileActivity.class);
            profileIntent.putExtra("username", username);
            profileIntent.putExtra("id", userId);
            startActivity(profileIntent);
        } else if (id == R.id.action_leaders) {
            //Do nothing, we're already there.
        }  else if (id == R.id.action_rejections) {
            Intent rejectionIntent = new Intent(this, StudentListActivity.class);
            rejectionIntent.putExtra("username", username);
            rejectionIntent.putExtra("id", userId);
            rejectionIntent.putExtra("rejections", true);
            startActivity(rejectionIntent);
        }

        return super.onOptionsItemSelected(item);
    }

    public class LeaderBoardListAdapter extends BaseAdapter {
        Context context;
        ArrayList<LeaderBoardEntry> leaders;
        private LayoutInflater inflater = null;

        public LeaderBoardListAdapter(Context context, ArrayList<LeaderBoardEntry> leaderBoardEntries) {
            this.context = context;
            this.leaders = leaderBoardEntries;
            inflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        }

        @Override
        public long getItemId(int position) {
            return leaders.get(position).getUser().getId();
        }

        @Override
        public Object getItem(int position) {
            return leaders.get(position);
        }

        @Override
        public View getView(int position, View convertView, ViewGroup parent) {
            View view = convertView;
            if (view == null) {
                view = inflater.inflate(R.layout.ranking_row, null);
            }
            LeaderBoardEntry boardEntry = leaders.get(position);

            TextView v =(TextView) (view.findViewById(R.id.ranking_int));
            String numLikes = "" + boardEntry.getLikes();
            if (numLikes.length() < 1) {
                numLikes = "0"; //This really shouldn't happen though...
            }
            v.setText(numLikes);

            v = (TextView)(view.findViewById(R.id.ranking_text));
            v.setText(boardEntry.getUser().getUsername());

            return view;
        }

        @Override
        public int getCount() {
            return leaders.size();
        }
    }


    public class GetMatchesTask extends AsyncTask<Void, Void, ArrayList<LeaderBoardEntry>> {
        @Override
        protected void onPostExecute(ArrayList<LeaderBoardEntry> users) {
            leaderBoard.setAdapter(new LeaderBoardListAdapter(getApplicationContext(), users));
        }

        @Override
        protected ArrayList<LeaderBoardEntry> doInBackground(Void... params) {
            String url = getString(R.string.http_address_server) + "/api/getLeaders";
            try {
                JSONObject json = GetRequester.doAGetRequest(url);
                JSONArray jsonArr = json.getJSONArray("leaders");
                for (int i = 0; i < jsonArr.length(); i++) {
                    JSONObject leaderBoardEntryJson = (JSONObject) jsonArr.get(i);
                    int numLikes = leaderBoardEntryJson.getInt("count");
                    User curr = JsonConverter.userFromJson(leaderBoardEntryJson.getJSONObject("user"));
                    leaders.add(new LeaderBoardEntry(curr, numLikes));
                }
            } catch (Exception e) {
                System.out.println(e.toString());
                System.out.println("ERROR on getting leaderboard entries");
            }
            return leaders;
        }
    }
}
