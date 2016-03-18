package com.se2.gradr.gradr;

import android.content.Intent;
import android.test.ActivityInstrumentationTestCase2;
import android.widget.EditText;

import com.robotium.solo.Solo;

/**
 * Created by caleb on 3/18/16.
 */
public class MatchListActivityTest extends ActivityInstrumentationTestCase2<MatchListActivity> {
    private Solo solo;

    public MatchListActivityTest() {
        super(MatchListActivity.class);
    }

    @Override
    public void setUp() throws Exception {
        Intent i = new Intent();
        i.putExtra("username","test_user_1");
        i.putExtra("id", 202);
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

    public void testChat() throws Exception {
        assertTrue(solo.waitForText("Test User2"));
        solo.clickOnText("Test User2");
        assertTrue(solo.waitForActivity(ViewMatchActivity.class));
        solo.clickOnText("CHAT");
    }

    @Override
    public void tearDown() throws Exception {
        solo.finishOpenedActivities();
    }
}