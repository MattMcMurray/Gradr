package com.se2.gradr.gradr;

import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.view.Menu;
import android.view.MenuItem;
import android.content.Intent;
import android.widget.EditText;
import android.widget.TextView;

/**
 * Created by maverickmueller on 3/15/2016.
 */
public class ProfileActivity extends AppCompatActivity {

    private EditText mAboutView;
    private EditText mHelpView;
    private EditText mSchoolView;
    private EditText mFirstNameView;
    private EditText mLastNameView;
    private EditText mCityView;
    private EditText mCountryView;
    private EditText mCoursesView;

    private TextView mUsernameView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.profile_activity);

        Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);

        mAboutView = (EditText) findViewById(R.id.tb_about);
        mHelpView = (EditText) findViewById(R.id.tb_help);
        mSchoolView = (EditText) findViewById(R.id.tb_school);
        mFirstNameView = (EditText) findViewById(R.id.tb_first_name);
        mLastNameView = (EditText) findViewById(R.id.tb_last_name);
        mCityView = (EditText) findViewById(R.id.tb_city);
        mCountryView = (EditText) findViewById(R.id.tb_country);
        mCoursesView = (EditText) findViewById(R.id.tb_courses);

        mUsernameView = (TextView) findViewById(R.id.label_username);
        mUsernameView.setText("Caleb the Mighty");

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
            matchesIntent.putExtra("username", "caleb");
            matchesIntent.putExtra("id", 205);
            startActivity(matchesIntent);
        } else if (id == R.id.action_profile) {
            //Do nothing, we're already there...
        }

        return super.onOptionsItemSelected(item);
    }

    private void setBirthdate() {

    }
}
