package com.se2.gradr.gradr;

import android.content.Intent;
import android.test.ActivityInstrumentationTestCase2;
import android.view.View;
import android.widget.EditText;
import android.widget.Spinner;
import android.widget.TextView;

import com.robotium.solo.Solo;

import java.sql.Time;
import java.util.Calendar;

/**
 * Created by caleb on 3/18/16.
 */

public class MatchStudentListActivityTest extends ActivityInstrumentationTestCase2<StudentListActivity> {
    private Solo solo;

    public MatchStudentListActivityTest() {
        super(StudentListActivity.class);
    }

    @Override
    public void setUp() throws Exception {
        Intent i = new Intent();
        i.putExtra("username","test_user_1");
        i.putExtra("id", 53);
        i.putExtra("rejections", false);
        setActivityIntent(i);
        solo = new Solo(getInstrumentation(), getActivity());
    }

    public void testMatchesLoad() throws Exception {
        assertTrue(solo.waitForText("Joyce Hudson"));
    }

    public void testViewMatchActivity() throws Exception {
        solo.clickOnText("Joyce Hudson");
        assertTrue(solo.waitForActivity(ViewMatchActivity.class));
        solo.goBack();
        assertTrue(solo.waitForActivity(StudentListActivity.class));
    }

    @Override
    public void tearDown() throws Exception {
        solo.finishOpenedActivities();
        super.tearDown();
    }
}