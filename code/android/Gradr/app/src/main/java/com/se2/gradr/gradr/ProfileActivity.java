package com.se2.gradr.gradr;

import android.animation.Animator;
import android.animation.AnimatorListenerAdapter;
import android.annotation.TargetApi;
import android.os.AsyncTask;
import android.os.Build;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.util.Patterns;
import android.view.Menu;
import android.view.MenuItem;
import android.content.Intent;
import android.view.View;
import android.widget.AutoCompleteTextView;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import com.se2.gradr.gradr.helpers.GetRequester;
import com.se2.gradr.gradr.helpers.PostRequester;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.w3c.dom.Text;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

/**
 * Created by maverickmueller on 3/15/2016.
 */
public class ProfileActivity extends AppCompatActivity {

    private String username;
    private int userId;

    private TextView mAboutView;
    private TextView mHelpView;
    private TextView mSchoolView;
    private TextView mFirstNameView;
    private TextView mLastNameView;
    private TextView mCityView;
    private TextView mCountryView;
    private TextView mCoursesView;
    private TextView mDobView;
    private TextView mPictureView;

    private LinearLayout mProfileFormView;
    private ProgressBar mProgressView;

    private TextView mUsernameView;

    private Toolbar toolbar;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        ThemeSelector.onActivityChangeTheme(this);
        setContentView(R.layout.profile_activity);

        Intent starter = getIntent();
        userId = starter.getIntExtra("id", -1);
        username = starter.getStringExtra("username");

        if (username == null || username.length() < 1 || userId < 0) {
            finish(); //Go back, we won't allow access to this without having the username and id
        }

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
        mDobView = (AutoCompleteTextView) findViewById(R.id.tb_dob);
        mPictureView = (AutoCompleteTextView) findViewById(R.id.tb_picture);

        mUsernameView = (TextView) findViewById(R.id.label_username);
        mUsernameView.setText(username);

        Button mSaveButton = (Button) findViewById(R.id.save_button);
        mSaveButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if (validate()) {
                    save();
                }
            }
        });

        showProgress(true);
        new LoadProfileHelper(userId).execute();

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
            Intent logoutIntent = new Intent(this, LoginActivity.class);
            logoutIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
            startActivity(logoutIntent);
        } else if (id == R.id.action_matches) {
            Intent matchesIntent = new Intent(this, MatchListActivity.class);
            matchesIntent.putExtra("username", username);
            matchesIntent.putExtra("id", userId);
            startActivity(matchesIntent);
        } else if (id == R.id.action_theme) {
            ThemeSelector.showThemeDialog(this);
        } else if (id == R.id.action_profile) {
            //Do nothing, we're already there...
        }

        return super.onOptionsItemSelected(item);
    }

    public class LoadProfileHelper extends AsyncTask<String, Void, Void> {
        private int id;

        LoadProfileHelper(int id) {
            this.id = id;
        }

        @Override
        protected Void doInBackground(String... params) {
            String stringUrl = getString(R.string.http_address_server) + "/api/getUser?user=" + username;
            System.out.println("string url: " + stringUrl);
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
                        mDobView.setText(user.getString("dateOfBirth").substring(0, 10));
                        mPictureView.setText(user.getString("picture"));
                    } catch (Exception e) {
                        System.out.println("Error parsing returned JSON: " + e.getMessage());
                    }
                    showProgress(false);
                }
            });


        }
    }

    public class SaveProfileHelper extends AsyncTask<String, Void, Void> {
        /* TO DO*/

        private int id;
        private String username, about, help, school, firstName, lastName, city, country, courses, picture;
        private Date dob;

        SaveProfileHelper(int id, String username, String about, String help, String school,
                          String firstName, String lastName, String city, String country,
                          String courses, Date dob, String picture) {
            this.id = id;
            this.username = username;
            this.about = about;
            this.help = help;
            this.school = school;
            this.firstName = firstName;
            this.lastName = lastName;
            this.city = city;
            this.country = country;
            this.courses = courses;
            this.dob = dob;
            this.picture = picture;
        }

        @Override
        protected Void doInBackground(String... params) {
            String stringUrl = getString(R.string.http_address_server) + "/api/ProfileUpdate";

            try {
                JSONObject profileInfo   = new JSONObject();
                profileInfo.put("id",userId);
                profileInfo.put("username", username);
                profileInfo.put("generalDescription",about);
                profileInfo.put("helpDescription",help);
                profileInfo.put("school",school);
                profileInfo.put("firstname",firstName);
                profileInfo.put("lastname",lastName);
                profileInfo.put("city",city);
                profileInfo.put("country",country);
                profileInfo.put("courses",courses);
                profileInfo.put("dateOfBirth",dob);
                profileInfo.put("picture",picture);

                System.out.println("SENDING - " + profileInfo.toString());

                String jsonString = PostRequester.doAPostRequest(stringUrl,profileInfo);
                if (jsonString == null) {
                    System.out.println("JSON was null for saving user info");
                }
            } catch (Exception e) {
                System.out.println("ERROR while saving user info");
                System.out.println(e.toString());
                e.printStackTrace();
            }

            return null;
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

    private void save()
    {
        String about, help, school, firstName, lastName, city, country, courses, picture;
        Date dob;

        showProgress(true);

        about = mAboutView.getText().toString();
        help = mHelpView.getText().toString();
        school = mSchoolView.getText().toString();
        firstName = mFirstNameView.getText().toString();
        lastName = mLastNameView.getText().toString();
        city = mCityView.getText().toString();
        country = mCountryView.getText().toString();
        courses = mCoursesView.getText().toString();
        picture = mPictureView.getText().toString();

        DateFormat format = new SimpleDateFormat("yyyy-MM-dd", Locale.ENGLISH);
        try {
            dob = format.parse(mDobView.getText().toString());
            if (mDobView.getText().toString().length() != 10)
            {
                throw new ParseException("Not a valid date", -1);
            }
            new SaveProfileHelper(userId,username,about,help,school,firstName,lastName,city,country,courses,dob,picture).execute();
            new LoadProfileHelper(userId).execute();
        } catch (ParseException e){
            System.out.println("Date formatted incorrectly: " + e.getMessage());
            mDobView.setError(getString(R.string.error_invalid_date));
            mDobView.requestFocus();
            showProgress(false);
        }

    }

    private boolean validate() {
        boolean isValid;
        String url = mPictureView.getText().toString();

        isValid = Patterns.WEB_URL.matcher(url).matches();

        if (!isValid) {
            Toast toast = Toast.makeText(getApplicationContext(), R.string.error_invalid_url, Toast.LENGTH_SHORT);
            toast.show();
        }

        return isValid;
    }
}
