package com.se2.gradr.gradr;

import android.content.Intent;
import android.os.AsyncTask;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.widget.ListView;

import com.se2.gradr.gradr.helpers.GetRequester;
import com.se2.gradr.gradr.helpers.JsonConverter;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;

public class MatchListActivity extends AppCompatActivity {

    private int userId;
    private String username;

    private ListView matchesList;
    private ArrayList<User> matches = null;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.match_list_activity);
        Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);


        Intent starter = getIntent();
        userId = starter.getIntExtra("id", -1);
        username = starter.getStringExtra("username");
        if (username == null || username.length() < 1 || userId < 0) {
            finish(); //Go back, we won't allow access to this without having the username and id
        }

        matches = new ArrayList<User>();
        new GetMatchesTask().execute();

        matchesList = (ListView) findViewById(R.id.match_list_view);
        matchesList.setAdapter(new MatchListAdapter(this, matches));
    }

    public class GetMatchesTask extends AsyncTask<Void, Void, User[]> {

        @Override
        protected void onPostExecute(User[] users) {
            for (int i = 0; i < users.length; i++) {
                matches.add(users[i]);
            }
            matchesList.setAdapter(new MatchListAdapter(getApplicationContext(), matches));
        }

        @Override
        protected User[] doInBackground(Void... params) {
            String url = getString(R.string.http_address_server) + "/api/getPotentialMatches?userId=" + userId;
            User[] users = new User[0];
            try {
                JSONObject json = GetRequester.doAGetRequest(url);
                JSONArray jsonArr = json.getJSONArray("matches");
                users = new User[jsonArr.length()];
                for (int i = 0; i < jsonArr.length(); i++) {
                    users[i] = JsonConverter.userFromJson((JSONObject) jsonArr.get(i));
                }
            } catch (Exception e) {
                System.out.println(e.toString());
                System.out.println("ERROR on getting matches");
            }
            return users;
        }
    }
}
