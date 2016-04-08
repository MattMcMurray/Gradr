package com.se2.gradr.gradr;

import android.content.Intent;
import android.test.ActivityInstrumentationTestCase2;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;

import com.robotium.solo.Solo;

public class ViewMatchActivityTest extends ActivityInstrumentationTestCase2<ViewMatchActivity> {
    private Solo solo;

    public ViewMatchActivityTest() {
        super(ViewMatchActivity.class);
    }

    @Override
    public void setUp() throws Exception {
        Intent i = new Intent();
        i.putExtra("username", "test_user_1");
        i.putExtra("id", 53);
        i.putExtra("match", new User("jhudson0", 1, "Joyce", "Hudson", null, null, null, null, null, null, "https://i.imgur.com/Ki3m2H9.jpg"));
        setActivityIntent(i);
        solo = new Solo(getInstrumentation(), getActivity());
    }

    public void testViewMatchProfile() throws Exception {
        assertTrue(solo.waitForText("Joyce Hudson"));
        ImageView imageView = (ImageView) solo.getView(R.id.match_image);
        assertNotNull(imageView);
    }

    public void testRatingSubmission() throws Exception {
        solo.clickOnText("RATINGS");

        solo.enterText((EditText) solo.getView(R.id.rating_comment), "terrible");
        solo.pressSpinnerItem(0, 1);
        solo.clickOnButton("Submit");
        solo.clearEditText((EditText) solo.getView(R.id.rating_comment));
        assertTrue(solo.waitForText("terrible"));
        assertTrue(solo.waitForText("2.0"));

        // Check overwrite
        solo.enterText((EditText) solo.getView(R.id.rating_comment), "good");
        solo.pressSpinnerItem(0,3);
        solo.clickOnButton("Submit");
        solo.clearEditText((EditText) solo.getView(R.id.rating_comment));
        assertTrue(solo.waitForText("good"));
        assertTrue(solo.waitForText("5.0"));
    }

    public void testChatFragment() throws Exception {
        solo.clickOnText("CHAT");
        assertTrue(solo.waitForText("Hello Joyce", 1, 30000));

        solo.enterText((EditText) solo.getView(R.id.message_box), "Testy test");
        solo.clickOnView(solo.getView(R.id.send_button));
        solo.clickOnView(solo.getView(R.id.refresh_button));
        assertTrue(solo.waitForText("test_user_1: Testy test"));
    }

    @Override
    public void tearDown() throws Exception {
        solo.finishOpenedActivities();
        super.tearDown();
    }
}