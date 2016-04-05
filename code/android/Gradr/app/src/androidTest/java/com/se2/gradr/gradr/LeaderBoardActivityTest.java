package com.se2.gradr.gradr;

import android.content.Intent;
import android.test.ActivityInstrumentationTestCase2;
import android.widget.EditText;
import android.widget.ListView;

import com.robotium.solo.Solo;

import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Created by evan on 3/18/16.
 */
public class LeaderBoardActivityTest extends ActivityInstrumentationTestCase2<LeaderBoardActivity> {
    private Solo solo;

    public LeaderBoardActivityTest() {
        super(LeaderBoardActivity.class);
    }

    @Override
    public void setUp() throws Exception {
        Intent i = new Intent();
        i.putExtra("username", "test_user_1");
        i.putExtra("id", 53);
        setActivityIntent(i);
        solo = new Solo(getInstrumentation(), getActivity());
    }

    public void testLeaderboard() throws Exception {
        ListView lv = (ListView) solo.getView(R.id.leaders_list_view);
        solo.waitForText("test_user_1");
        assertTrue(lv.getCount() > 0);
    }

    @Override
    public void tearDown() throws Exception {
        solo.finishOpenedActivities();
        super.tearDown();
    }
}