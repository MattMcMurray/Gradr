package com.se2.gradr.gradr;

import android.test.ActivityInstrumentationTestCase2;
import android.widget.EditText;

import com.robotium.solo.Solo;

import junit.framework.TestCase;

import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Created by evan on 3/18/16.
 */
public class SignUpActivityTest extends ActivityInstrumentationTestCase2<SignUpActivity> {
    private Solo solo;

    public SignUpActivityTest() {
        super(SignUpActivity.class);
    }

    @Override
    public void setUp() throws Exception {
        solo = new Solo(getInstrumentation(), getActivity());
    }

    public void testPasswordsDoNotMatch() throws Exception {
        solo.enterText((EditText) solo.getView(R.id.username), "wrongpasswords");
        solo.enterText((EditText) solo.getView(R.id.password), "hunter2");
        solo.enterText((EditText) solo.getView(R.id.confirm_password), "hunter3");
        solo.clickOnButton("Register");
        assertTrue(solo.waitForText("Your passwords do not match"));
        solo.assertCurrentActivity("SignUpActivity", SignUpActivity.class);
    }

    public void testEmptyPassword() throws Exception {
        solo.enterText((EditText) solo.getView(R.id.username), "emptypassword");
        solo.clickOnButton("Register");
        assertTrue(solo.waitForText("This password is too short"));
        solo.assertCurrentActivity("SignUpActivity", SignUpActivity.class);
    }

    public void testValidAccountCreation() throws Exception {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMMddHHmmssSSS");
        Date currentDate = new Date();

        solo.enterText((EditText) solo.getView(R.id.username), dateFormat.format(currentDate));
        solo.enterText((EditText) solo.getView(R.id.password), "hunter2");
        solo.enterText((EditText) solo.getView(R.id.confirm_password), "hunter2");
        solo.clickOnButton("Register");
        assertTrue(solo.waitForActivity(LoginActivity.class));
    }

    @Override
    public void tearDown() throws Exception {
        solo.finishOpenedActivities();
        super.tearDown();
    }
}