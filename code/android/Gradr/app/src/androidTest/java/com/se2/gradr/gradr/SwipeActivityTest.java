package com.se2.gradr.gradr;

import android.content.Intent;
import android.content.res.Resources;
import android.graphics.Point;
import android.provider.ContactsContract;
import android.test.ActivityInstrumentationTestCase2;
import android.util.DisplayMetrics;
import android.view.Display;
import android.widget.EditText;

import com.robotium.solo.Solo;

import junit.framework.TestCase;

public class SwipeActivityTest extends ActivityInstrumentationTestCase2<SwipeActivity> {
    private Solo solo;

    public SwipeActivityTest() {
        super(SwipeActivity.class);
    }

    @Override
    public void setUp() throws Exception {
        Intent i = new Intent();
        i.putExtra("username","test_user_1");
        i.putExtra("id", 53);
        setActivityIntent(i);
        solo = new Solo(getInstrumentation(), getActivity());
    }

    public void testProfileButton() throws Exception {
        solo.clickOnView(getActivity().findViewById(R.id.action_profile));
        assertTrue(solo.waitForActivity(ProfileActivity.class));
    }

    public void testMatchesButton() throws Exception {
        solo.clickOnView(getActivity().findViewById(R.id.action_matches));
        assertTrue(solo.waitForActivity(StudentListActivity.class));
    }

    public void testThemes() throws Exception {
        solo.clickOnMenuItem("Theme", true);
        solo.clickOnText("Fire");
        assertTrue(solo.waitForDialogToClose());
        assertTrue(solo.waitForActivity(SwipeActivity.class));
        solo.clickOnMenuItem("Theme", true);
        solo.clickOnText("Default");
        assertTrue(solo.waitForDialogToClose());
        assertTrue(solo.waitForActivity(SwipeActivity.class));
    }

    public void testPassMatch() throws Exception {
        float fromX, fromY, toX, toY;

        Display display = getActivity().getWindowManager().getDefaultDisplay();
        Point size = new Point();
        display.getSize(size);
        int width = size.x;
        int height = size.y;

        fromX = width / 2;
        fromY = height / 2;
        toX = width;
        toY = height / 2;
        solo.drag(fromX, toX, fromY, toY, 10);
        assertTrue(solo.waitForText("Pass"));
    }

    public void testFailMatch() throws Exception {
        float fromX, fromY, toX, toY;

        Display display = getActivity().getWindowManager().getDefaultDisplay();
        Point size = new Point();
        display.getSize(size);
        int width = size.x;
        int height = size.y;

        fromX = width / 2;
        fromY = height / 2;
        toX = 0;
        toY = height / 2;
        solo.drag(fromX, toX, fromY, toY, 10);
        assertTrue(solo.waitForText("Fail"));
    }

    @Override
    public void tearDown() throws Exception {
        solo.finishOpenedActivities();
        super.tearDown();
    }
}