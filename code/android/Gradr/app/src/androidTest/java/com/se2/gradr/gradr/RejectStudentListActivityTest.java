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

    @Override
    public void tearDown() throws Exception {
        solo.finishOpenedActivities();
        super.tearDown();
    }
}