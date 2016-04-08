package com.se2.gradr.gradr;

import android.content.Intent;
import android.test.ActivityInstrumentationTestCase2;
import android.widget.EditText;
import android.widget.ImageView;

import com.robotium.solo.Solo;

public class ViewRejectorActivityTest extends ActivityInstrumentationTestCase2<ViewRejectorActivity> {
    private Solo solo;

    public ViewRejectorActivityTest() {
        super(ViewRejectorActivity.class);
    }

    @Override
    public void setUp() throws Exception {
        Intent i = new Intent();
        i.putExtra("username", "test_user_1");
        i.putExtra("id", 53);
        i.putExtra("match", new User("jflores1", 2, "Justin", "Flores", null, null, null, null, null, null, "https://i.imgur.com/Ki3m2H9.jpg"));
        setActivityIntent(i);
        solo = new Solo(getInstrumentation(), getActivity());
    }

    public void testViewRejectProfile() throws Exception {
        assertTrue(solo.waitForText("NO RATING OR CHATTING"));
        assertTrue(solo.waitForText("Justin Flores"));
        ImageView imageView = (ImageView) solo.getView(R.id.match_image);
        assertNotNull(imageView);
    }

    @Override
    public void tearDown() throws Exception {
        solo.finishOpenedActivities();
        super.tearDown();
    }
}