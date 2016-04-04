package com.se2.gradr.gradr;

import android.content.Intent;
import android.test.ActivityInstrumentationTestCase2;

import com.robotium.solo.Solo;
import com.se2.gradr.gradr.StudentListActivity;
import com.se2.gradr.gradr.ViewMatchActivity;

/**
 * Created by caleb on 3/18/16.
 */

public class RejectStudentListActivityTest extends ActivityInstrumentationTestCase2<StudentListActivity> {
    private Solo solo;

    public RejectStudentListActivityTest() {
        super(StudentListActivity.class);
    }

    @Override
    public void setUp() throws Exception {
        Intent i = new Intent();
        i.putExtra("username","test_user_1");
        i.putExtra("id", 53);
        i.putExtra("rejections", true);
        setActivityIntent(i);
        solo = new Solo(getInstrumentation(), getActivity());
    }

    public void testRejectsLoad() throws Exception {
        assertTrue(solo.waitForText("Justin Flores"));
    }

    public void testViewRejectActivity() throws Exception {
        solo.clickOnText("Justin Flores");
        assertTrue(solo.waitForActivity(ViewRejectorActivity.class));
    }

//    public void testMatchViewHasElements() throws Exception {
//        assertTrue(solo.waitForText("Test User2"));
//        solo.clickOnText("Test User2");
//        assertTrue(solo.waitForActivity(ViewMatchActivity.class));
//        assertTrue(solo.waitForText("Test User2"));
//        assertTrue(solo.waitForText("Sniper School"));
//        assertTrue(solo.waitForText("Dauphin"));
//        assertTrue(solo.waitForText("Canada"));
//        solo.clickOnText("RATINGS");
//        assertTrue(solo.waitForText("Average rating"));
//        assertTrue(solo.waitForText("Test User2"));
//        solo.clickOnText("CHAT");
//        solo.clickOnButton("Refresh");
//    }
//
//    public void testRatingSubmission() throws Exception {
//        assertTrue(solo.waitForText("Test User2"));
//        solo.clickOnText("Test User2");
//        assertTrue(solo.waitForActivity(ViewMatchActivity.class));
//        assertTrue(solo.waitForText("Test User2"));
//        solo.clickOnText("RATINGS");
//        solo.enterText((EditText) solo.getView(R.id.rating_comment), "terrible");
//        solo.pressSpinnerItem(0, 1);
//        solo.clickOnButton("Submit");
//        solo.clearEditText((EditText) solo.getView(R.id.rating_comment));
//        assertTrue(solo.waitForText("terrible"));
//        assertTrue(solo.waitForText("2.0"));
//        //check overwrite
//        solo.enterText((EditText) solo.getView(R.id.rating_comment), "good");
//        solo.pressSpinnerItem(0,3);
//        solo.clickOnButton("Submit");
//        solo.clearEditText((EditText) solo.getView(R.id.rating_comment));
//        assertTrue(solo.waitForText("good"));
//        assertTrue(solo.waitForText("5.0"));
//    }

    @Override
    public void tearDown() throws Exception {
        solo.finishOpenedActivities();
        super.tearDown();
    }
}