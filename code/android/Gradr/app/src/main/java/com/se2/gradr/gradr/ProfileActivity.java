package com.se2.gradr.gradr;

import android.animation.Animator;
import android.animation.AnimatorListenerAdapter;
import android.annotation.TargetApi;
import android.os.AsyncTask;
import android.os.Build;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.view.Menu;
import android.view.MenuItem;
import android.content.Intent;
import android.view.View;
import android.widget.AutoCompleteTextView;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.TextView;

import com.se2.gradr.gradr.helpers.GetRequester;
import com.se2.gradr.gradr.helpers.PostRequester;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/**
 * Created by maverickmueller on 3/15/2016.
 */
public class ProfileActivity extends AppCompatActivity {

    private String username;
    private int userId;

    private AutoCompleteTextView mAboutView;
    private AutoCompleteTextView mHelpView;
    private AutoCompleteTextView mSchoolView;
    private AutoCompleteTextView mFirstNameView;
    private AutoCompleteTextView mLastNameView;
    private AutoCompleteTextView mCityView;
    private AutoCompleteTextView mCountryView;
    private AutoCompleteTextView mCoursesView;

    private LinearLayout mProfileFormView;
    private ProgressBar mProgressView;

    private TextView mUsernameView;

    private Toolbar toolbar;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.profile_activity);

        Intent starter = getIntent();
        userId = starter.getIntExtra("id", -1);
        username = starter.getStringExtra("username");

        if (username == null || username.length() < 1 || userId < 0) {
            finish(); //Go back, we won't allow access to this without having the username and id
        }

        toolbar = (Toolbar) findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);

        mAboutView = (AutoCompleteTextView) findViewById(R.id.tb_about);
        mHelpView = (AutoCompleteTextView) findViewById(R.id.tb_help);
        mSchoolView = (AutoCompleteTextView) findViewById(R.id.tb_school);
        mFirstNameView = (AutoCompleteTextView) findViewById(R.id.tb_first_name);
        mLastNameView = (AutoCompleteTextView) findViewById(R.id.tb_last_name);
        mCityView = (AutoCompleteTextView) findViewById(R.id.tb_city);
        mCountryView = (AutoCompleteTextView) findViewById(R.id.tb_country);
        mCoursesView = (AutoCompleteTextView) findViewById(R.id.tb_courses);
        mProfileFormView = (LinearLayout) findViewById(R.id.profile_form);
        mProgressView = (ProgressBar) findViewById(R.id.profile_progress);

        mUsernameView = (TextView) findViewById(R.id.label_username);
        mUsernameView.setText(username);

        showProgress(true);
        new ProfileHelper(userId).execute();

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

        //noinspection SimplifiableIfStatement
        if (id == R.id.action_logout) {
            System.out.println("NOT IMPLEMENTED");
        } else if (id == R.id.action_matches) {
            Intent matchesIntent = new Intent(this, MatchListActivity.class);
            matchesIntent.putExtra("username", username);
            matchesIntent.putExtra("id", userId);
            startActivity(matchesIntent);
        } else if (id == R.id.action_profile) {
            //Do nothing, we're already there...
        }

        return super.onOptionsItemSelected(item);
    }

    public class ProfileHelper extends AsyncTask<String, Void, Void> {
        private int id;

        ProfileHelper(int id) {
            this.id = id;
        }

        @Override
        protected Void doInBackground(String... params) {
            String stringUrl = getString(R.string.http_address_server) + "/api/getUser?user=" + username;
            System.out.println("string irl: " + stringUrl);
            try {
                JSONObject json = GetRequester.doAGetRequest(stringUrl);
                if (json == null) {
                    System.out.println("JSON was null for obtaining user info");
                } else {
                    System.out.println("GOT ONE: " + json.toString());
                    populateForm(json.getJSONObject("user"));
                }
            } catch (Exception e) {
                System.out.println("ERROR while obtaining user info");
                System.out.println(e.toString());
                e.printStackTrace();
            }

            return null;
        }

        private void populateForm(final JSONObject user) {

            runOnUiThread(new Runnable() {
                @Override
                public void run() {

                    try {
                        mAboutView.setText(user.getString("generalDescription"));
                        mHelpView.setText(user.getString("helpDescription"));
                        mSchoolView.setText(user.getString("school"));
                        mFirstNameView.setText(user.getString("firstname"));
                        mLastNameView.setText(user.getString("lastname"));
                        mCityView.setText(user.getString("city"));
                        mCountryView.setText(user.getString("country"));
                        mCoursesView.setText(user.getString("courses"));
                    } catch (Exception e) {
                        System.out.println("Error parsing returned JSON: " + e.getMessage());
                    }
                    showProgress(false);
                }
            });


        }
    }

    @TargetApi(Build.VERSION_CODES.HONEYCOMB_MR2)
    private void showProgress(final boolean show) {
        // On Honeycomb MR2 we have the ViewPropertyAnimator APIs, which allow
        // for very easy animations. If available, use these APIs to fade-in
        // the progress spinner.
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.HONEYCOMB_MR2) {
            int shortAnimTime = getResources().getInteger(android.R.integer.config_shortAnimTime);

            mProfileFormView.setVisibility(show ? View.GONE : View.VISIBLE);
            mProfileFormView.animate().setDuration(shortAnimTime).alpha(
                    show ? 0 : 1).setListener(new AnimatorListenerAdapter() {
                @Override
                public void onAnimationEnd(Animator animation) {
                    mProfileFormView.setVisibility(show ? View.GONE : View.VISIBLE);
                }
            });

            mProgressView.setVisibility(show ? View.VISIBLE : View.GONE);
            mProgressView.animate().setDuration(shortAnimTime).alpha(
                    show ? 1 : 0).setListener(new AnimatorListenerAdapter() {
                @Override
                public void onAnimationEnd(Animator animation) {
                    mProgressView.setVisibility(show ? View.VISIBLE : View.GONE);
                }
            });
        } else {
            // The ViewPropertyAnimator APIs are not available, so simply show
            // and hide the relevant UI components.
            mProgressView.setVisibility(show ? View.VISIBLE : View.GONE);
            mProfileFormView.setVisibility(show ? View.GONE : View.VISIBLE);
        }
    }

    private void setBirthdate() {

    }
}
