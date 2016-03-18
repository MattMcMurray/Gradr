package com.se2.gradr.gradr;

import android.support.v4.widget.SwipeRefreshLayout;
import android.test.ActivityInstrumentationTestCase2;
import android.widget.EditText;

import com.robotium.solo.Solo;

import junit.framework.Assert;
import junit.framework.TestCase;

public class LoginActivityTest extends ActivityInstrumentationTestCase2<LoginActivity> {
    private Solo solo;

    public LoginActivityTest() {
        super(LoginActivity.class);
    }

    @Override
    public void setUp() throws Exception {
        solo = new Solo(getInstrumentation(), getActivity());
    }

    public void testValidLogin() throws Exception {
        solo.enterText((EditText) solo.getView(R.id.email), "test_user_1");
        solo.enterText((EditText) solo.getView(R.id.password), "test_user_1");
        solo.clickOnButton("Login");
        assertTrue(solo.waitForActivity(SwipeActivity.class));
    }

    public void testInvalidLogin() throws Exception {
        solo.enterText((EditText) solo.getView(R.id.email), "wrong_user");
        solo.enterText((EditText) solo.getView(R.id.password), "wrong_password");
        solo.clickOnButton("Login");
        assertTrue(solo.waitForText("This password is incorrect"));
        solo.assertCurrentActivity("LoginActivity", LoginActivity.class);
    }

    @Override
    public void tearDown() throws Exception {
        solo.finishOpenedActivities();
    }
}