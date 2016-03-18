package com.se2.gradr.gradr;

import android.content.Context;
import android.content.Intent;
import android.os.AsyncTask;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.BaseAdapter;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.TextView;

import com.se2.gradr.gradr.helpers.GetRequester;
import com.se2.gradr.gradr.helpers.JsonConverter;

import org.json.JSONArray;
import org.json.JSONObject;

import java.lang.reflect.Array;
import java.util.ArrayList;

public class MatchListActivity extends AppCompatActivity {

    private int userId;
    private String username;

    private ListView matchesList;
    private ArrayList<UserAndImage> matches = null;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        ThemeSelector.onActivityChangeTheme(this);
        setContentView(R.layout.match_list_activity);

        Intent starter = getIntent();
        userId = starter.getIntExtra("id", -1);
        username = starter.getStringExtra("username");
        if (username == null || username.length() < 1 || userId < 0) {
            finish(); //Go back, we won't allow access to this without having the username and id
        }

        matches = new ArrayList<UserAndImage>();
        new GetMatchesTask().execute();

        matchesList = (ListView) findViewById(R.id.match_list_view);
        matchesList.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> a, View view, int position, long id) {
                if (username == null || username.length() < 1 || userId < 0) {
                    return; //We won't change activities if we have invalid username or userId
                }
                Intent viewMatchIntent = new Intent(MatchListActivity.this, ViewMatchActivity.class);
                viewMatchIntent.putExtra("username", username);
                viewMatchIntent.putExtra("id", userId);

                //We can't serialize the image, but the rest of the user is serializable.
                //We'll have to get the image again on the other side
                viewMatchIntent.putExtra("match", matches.get(position).getUser());
                startActivity(viewMatchIntent);
            }
        });
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
            //Do nothing, we're already there...
        } else if (id == R.id.action_theme) {
            ThemeSelector.showThemeDialog(this);
        } else if (id == R.id.action_profile) {
            Intent profileIntent = new Intent(this, ProfileActivity.class);
            profileIntent.putExtra("username", username);
            profileIntent.putExtra("id", id);
            startActivity(profileIntent);
        }

        return super.onOptionsItemSelected(item);
    }

    public class MatchListAdapter extends BaseAdapter {
        Context context;
        ArrayList<UserAndImage> matches;
        private LayoutInflater inflater = null;

        public MatchListAdapter(Context context, ArrayList<UserAndImage> matches) {
            this.context = context;
            this.matches = matches;
            inflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        }

        @Override
        public long getItemId(int position) {
            return matches.get(position).getId();
        }

        @Override
        public Object getItem(int position) {
            return matches.get(position);
        }

        @Override
        public View getView(int position, View convertView, ViewGroup parent) {
            View view = convertView;
            if (view == null) {
                view = inflater.inflate(R.layout.match_row, null);
            }
            UserAndImage user = matches.get(position);
            ImageView imageView = (ImageView) view.findViewById(R.id.match_image);
            user.setImage(imageView);

            TextView v =(TextView) (view.findViewById(R.id.match_name));
            String name = user.getFirstName() + " " + user.getLastName();
            if (name == null || name.length() < 2) {
                name = user.getUsername();
            }
            v.setText("name = " + name);
            v = (TextView)(view.findViewById(R.id.match_school));
            v.setText("School = " + user.getSchool());
            v = (TextView)(view.findViewById(R.id.match_courses));
            v.setText("Courses = " + user.getCourses());

            return view;
        }

        @Override
        public int getCount() {
            return matches.size();
        }
    }


    public class GetMatchesTask extends AsyncTask<Void, Void, ArrayList<UserAndImage>> {
        @Override
        protected void onPostExecute(ArrayList<UserAndImage> users) {
            matchesList.setAdapter(new MatchListAdapter(getApplicationContext(), users));
        }

        @Override
        protected ArrayList<UserAndImage> doInBackground(Void... params) {
            String url = getString(R.string.http_address_server) + "/api/getPotentialMatches?userId=" + userId;
//            ArrayList<User> users = new ArrayList<User>();
            try {
                JSONObject json = GetRequester.doAGetRequest(url);
                JSONArray jsonArr = json.getJSONArray("matches");
                for (int i = 0; i < jsonArr.length(); i++) {
                    User curr = JsonConverter.userFromJson((JSONObject) jsonArr.get(i));
                    matches.add(new UserAndImage(curr));
                }
            } catch (Exception e) {
                System.out.println(e.toString());
                System.out.println("ERROR on getting matches");
            }
            return matches;
        }
    }
}
