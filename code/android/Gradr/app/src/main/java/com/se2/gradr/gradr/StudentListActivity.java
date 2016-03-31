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
import android.widget.AdapterView;
import android.widget.BaseAdapter;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.TextView;

import com.se2.gradr.gradr.helpers.GetRequester;
import com.se2.gradr.gradr.helpers.JsonConverter;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;

/**
 * Created by steve on 30/03/16.
 */
public class StudentListActivity extends AppCompatActivity {
    private static String MATCHES_API = "/api/getPotentialMatches";
    //TODO: change this to the actual rejections API
    private static String REJECTIONS_API = "/api/getPotentialMatches";

    private static String MATCHES_JSON_ARRAY_NAME = "matches";
    //TODO: change this to the actual rejections Json array name
    private static String REJECTIONS_JSON_ARRAY_NAME = "matches";

    private int userId;
    private String username;
    private boolean isRejectionPage = false;

    private ListView studentList;
    private ArrayList<UserAndImage> students = null;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        ThemeSelector.onActivityChangeTheme(this);
        setContentView(R.layout.student_list_activity);

        Intent starter = getIntent();
        userId = starter.getIntExtra("id", -1);
        username = starter.getStringExtra("username");
        if (username == null || username.length() < 1 || userId < 0) {
            finish(); //Go back, we won't allow access to this without having the username and id
        }
        isRejectionPage = starter.getBooleanExtra("rejections", false); //Default to false if doesn't exist.

        String url = getString(R.string.http_address_server);
        String jsonArrayName;
        if (isRejectionPage) {
            setTitle("View Rejectors");
            url += REJECTIONS_API + "?userId=" + userId;
            jsonArrayName = REJECTIONS_JSON_ARRAY_NAME;
        } else {
            url += MATCHES_API + "?userId=" + userId;
            jsonArrayName = MATCHES_JSON_ARRAY_NAME;
        }

        new GetStudentsTask(jsonArrayName, url).execute();

        studentList = (ListView) findViewById(R.id.match_list_view);
        studentList.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> a, View view, int position, long id) {
                if (username == null || username.length() < 1 || userId < 0) {
                    return; //We won't change activities if we have invalid username or userId
                }
                Intent viewStudentIntent;
                if (isRejectionPage) {
                    viewStudentIntent = new Intent(StudentListActivity.this, ViewRejectorActivity.class);
                } else {
                    viewStudentIntent = new Intent(StudentListActivity.this, ViewMatchActivity.class);
                }
                viewStudentIntent.putExtra("username", username);
                viewStudentIntent.putExtra("id", userId);

                //We can't serialize the image, but the rest of the user is serializable.
                //We'll have to get the image again on the other side
                viewStudentIntent.putExtra("match", students.get(position).getUser());
                startActivity(viewStudentIntent);
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
        } else if (id == R.id.action_matches && isRejectionPage) {
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
            Intent leaderIntent = new Intent(this, LeaderBoardActivity.class);
            leaderIntent.putExtra("username", username);
            leaderIntent.putExtra("id", userId);
            startActivity(leaderIntent);
        } else if (id == R.id.action_rejections && !isRejectionPage) {
            Intent rejectionIntent = new Intent(this, StudentListActivity.class);
            rejectionIntent.putExtra("username", username);
            rejectionIntent.putExtra("id", userId);
            rejectionIntent.putExtra("rejections", true);
            startActivity(rejectionIntent);
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
                view = inflater.inflate(R.layout.student_row, null);
            }
            UserAndImage user = matches.get(position);
            ImageView imageView = (ImageView) view.findViewById(R.id.match_image);
            imageView.setScaleType(ImageView.ScaleType.FIT_CENTER);
            user.setImage(imageView);

            TextView v =(TextView) (view.findViewById(R.id.match_name));
            String name = user.getFirstName() + " " + user.getLastName();
            if (name == null || name.length() < 2) {
                name = user.getUsername();
            }
            v.setText("Name: " + name);
            v = (TextView)(view.findViewById(R.id.match_school));
            v.setText("School: " + user.getSchool());
            v = (TextView)(view.findViewById(R.id.match_courses));
            v.setText("Courses: " + user.getCourses());

            return view;
        }

        @Override
        public int getCount() {
            return matches.size();
        }
    }


    public class GetStudentsTask extends AsyncTask<Void, Void, ArrayList<UserAndImage>> {
        private String jsonArrayName; //The name of the JSON array containing the students
        private String requestUrl; //The url for getting the students

        public GetStudentsTask(String jsonArrayName, String requestUrl) {
            this.jsonArrayName = jsonArrayName;
            this.requestUrl = requestUrl;
        }

        @Override
        protected void onPostExecute(ArrayList<UserAndImage> users) {
            students = users;
            studentList.setAdapter(new MatchListAdapter(getApplicationContext(), users));
        }

        @Override
        protected ArrayList<UserAndImage> doInBackground(Void... params) {
            ArrayList<UserAndImage> students = new ArrayList<UserAndImage>();
            try {
                JSONObject json = GetRequester.doAGetRequest(requestUrl);
                JSONArray jsonArr = json.getJSONArray(jsonArrayName);
                for (int i = 0; i < jsonArr.length(); i++) {
                    User curr = JsonConverter.userFromJson((JSONObject) jsonArr.get(i));
                    students.add(new UserAndImage(curr));
                }
            } catch (Exception e) {
                System.out.println(e.toString());
                System.out.println("ERROR on getting " + jsonArrayName);
            }
            return students;
        }
    }

}
