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

public class StudentListActivityTest extends ActivityInstrumentationTestCase2<StudentListActivity> {
    private Solo solo;

    public StudentListActivityTest() {
        super(StudentListActivity.class);
    }

    @Override
    public void setUp() throws Exception {
        Intent i = new Intent();
        i.putExtra("username","test_user_1");
        i.putExtra("id", 202);
        i.putExtra("rejections", false);
        setActivityIntent(i);
        solo = new Solo(getInstrumentation(), getActivity());
    }

    public void testMatchesLoad() throws Exception {
        assertTrue(solo.waitForText("Test User2"));
    }

    public void testLinkToViewMatch() throws Exception {
        assertTrue(solo.waitForText("Test User2"));
        solo.clickOnText("Test User2");
        assertTrue(solo.waitForActivity(ViewMatchActivity.class));
    }

    public void testMatchViewHasElements() throws Exception {
        assertTrue(solo.waitForText("Test User2"));
        solo.clickOnText("Test User2");
        assertTrue(solo.waitForActivity(ViewMatchActivity.class));
        assertTrue(solo.waitForText("Test User2"));
        assertTrue(solo.waitForText("Sniper School"));
        assertTrue(solo.waitForText("Dauphin"));
        assertTrue(solo.waitForText("Canada"));
        assertTrue(solo.waitForText("Sniping 101, Stealth 1010"));
        assertTrue(solo.waitForText("I am super smrt."));
        assertTrue(solo.waitForText("Nothing, I don't even know why I'm here"));
        solo.clickOnText("RATINGS");
        assertTrue(solo.waitForText("Average rating"));
        assertTrue(solo.waitForText("Test User2"));
        solo.clickOnText("CHAT");
        solo.clickOnButton("Refresh");
        assertTrue(solo.waitForText("test_user_1"));
        assertTrue(solo.waitForText("test_user_2"));
    }

    public void testRatingSubmission() throws Exception {
        assertTrue(solo.waitForText("Test User2"));
        solo.clickOnText("Test User2");
        assertTrue(solo.waitForActivity(ViewMatchActivity.class));
        assertTrue(solo.waitForText("Test User2"));
        solo.clickOnText("RATINGS");
        solo.enterText((EditText) solo.getView(R.id.rating_comment), "terrible");
        solo.pressSpinnerItem(0, 1);
        solo.clickOnButton("Submit");
        solo.clearEditText((EditText) solo.getView(R.id.rating_comment));
        assertTrue(solo.waitForText("terrible"));
        assertTrue(solo.waitForText("2.0"));
        //check overwrite
        solo.enterText((EditText) solo.getView(R.id.rating_comment), "good");
        solo.pressSpinnerItem(0,3);
        solo.clickOnButton("Submit");
        solo.clearEditText((EditText) solo.getView(R.id.rating_comment));
        assertTrue(solo.waitForText("good"));
        assertTrue(solo.waitForText("5.0"));


    }

    @Override
    public void tearDown() throws Exception {
        solo.finishOpenedActivities();
        super.tearDown();
    }
}