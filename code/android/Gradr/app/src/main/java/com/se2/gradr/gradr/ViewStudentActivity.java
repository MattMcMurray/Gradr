package com.se2.gradr.gradr;

import android.content.Intent;
import android.net.Uri;
import android.support.design.widget.TabLayout;
import android.support.design.widget.FloatingActionButton;
import android.support.design.widget.Snackbar;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;

import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentPagerAdapter;
import android.support.v4.view.ViewPager;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;

import android.widget.TextView;

import com.se2.gradr.gradr.fragments.ChatMatchFragment;
import com.se2.gradr.gradr.fragments.RateMatchFragment;
import com.se2.gradr.gradr.fragments.ViewMatchFragment;

public class ViewStudentActivity extends AppCompatActivity implements ViewMatchFragment.OnFragmentInteractionListener {

    //currUser info
    protected int userId;
    protected String username;

    //The current match we're viewing
    protected UserAndImage currStudent;

    /**
     * The {@link android.support.v4.view.PagerAdapter} that will provide
     * fragments for each of the sections. We use a
     * {@link FragmentPagerAdapter} derivative, which will keep every
     * loaded fragment in memory. If this becomes too memory intensive, it
     * may be best to switch to a
     * {@link android.support.v4.app.FragmentStatePagerAdapter}.
     */
    protected FragmentPagerAdapter mSectionsPagerAdapter;

    /**
     * The {@link ViewPager} that will host the section contents.
     */
    protected ViewPager mViewPager;

    public void onFragmentInteraction(Uri uri) {
        //This function is required when adding fragments
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        ThemeSelector.onActivityChangeTheme(this);
        setContentView(R.layout.view_student_activity);

        Intent starter = getIntent();
        userId = starter.getIntExtra("id", -1);
        username = starter.getStringExtra("username");
        if (username == null || username.length() < 1 || userId < 0) {
            finish(); //Go back, we won't allow access to this without having the username and id
        }
        User currUser = (User) starter.getSerializableExtra("match");
        currStudent = new UserAndImage(currUser);
    }

    //Required to show the toolbar
    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.main_menu, menu);
        return true;
    }

    //Executes calls when you click the toolbar
    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
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
            Intent leaderIntent = new Intent(this, LeaderBoardActivity.class);
            leaderIntent.putExtra("username", username);
            leaderIntent.putExtra("id", userId);
            startActivity(leaderIntent);
        } else if (id == R.id.action_rejections) {
            Intent rejectionIntent = new Intent(this, StudentListActivity.class);
            rejectionIntent.putExtra("username", username);
            rejectionIntent.putExtra("id", userId);
            rejectionIntent.putExtra("rejections", true);
            startActivity(rejectionIntent);
        }

        return super.onOptionsItemSelected(item);
    }

    /**
     * A placeholder fragment containing a simple view.
     * We keep it around just in case we encounter errors and don't want bad things to happen
     */
    public static class PlaceholderFragment extends Fragment {
        /**
         * The fragment argument representing the section number for this
         * fragment.
         */
        private static final String ARG_SECTION_NUMBER = "section_number";

        public PlaceholderFragment() {
        }

        /**
         * Returns a new instance of this fragment for the given section
         * number.
         */
        public static PlaceholderFragment newInstance(int sectionNumber) {
            PlaceholderFragment fragment = new PlaceholderFragment();
            Bundle args = new Bundle();
            args.putInt(ARG_SECTION_NUMBER, sectionNumber);
            fragment.setArguments(args);
            return fragment;
        }

        @Override
        public View onCreateView(LayoutInflater inflater, ViewGroup container,
                                 Bundle savedInstanceState) {
            View rootView = inflater.inflate(R.layout.view_match_fragment, container, false);
            TextView textView = (TextView) rootView.findViewById(R.id.section_label);
            textView.setText(getString(R.string.section_format, getArguments().getInt(ARG_SECTION_NUMBER)));
            return rootView;
        }
    }
}
