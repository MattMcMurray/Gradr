package com.se2.gradr.gradr;

import android.content.Intent;
import android.test.ActivityInstrumentationTestCase2;
import android.widget.EditText;

import com.robotium.solo.Solo;

import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Created by caleb on 3/18/16.
 */
public class ProfileActivityTest extends ActivityInstrumentationTestCase2<ProfileActivity> {
    private Solo solo;

    public ProfileActivityTest() {
        super(ProfileActivity.class);
    }

    @Override
    public void setUp() throws Exception {
        Intent i = new Intent();
        i.putExtra("username","test_user_1");
        i.putExtra("id", 202);
        setActivityIntent(i);
        solo = new Solo(getInstrumentation(), getActivity());

        solo.clearEditText((EditText) solo.getView(R.id.tb_about));
        solo.clearEditText((EditText) solo.getView(R.id.tb_help));
        solo.clearEditText((EditText) solo.getView(R.id.tb_school));
        solo.clearEditText((EditText) solo.getView(R.id.tb_first_name));
        solo.clearEditText((EditText) solo.getView(R.id.tb_last_name));
        solo.clearEditText((EditText) solo.getView(R.id.tb_city));
        solo.clearEditText((EditText) solo.getView(R.id.tb_country));
        solo.clearEditText((EditText) solo.getView(R.id.tb_courses));
        solo.clearEditText((EditText) solo.getView(R.id.tb_dob));
        //currently, birthdate is always required
    }

    public void testGoodSave() throws Exception {
        solo.enterText((EditText) solo.getView(R.id.tb_about), "I own multiple ferrets");
        solo.enterText((EditText) solo.getView(R.id.tb_help), "Uncuffing myself from this radiator");
        solo.enterText((EditText) solo.getView(R.id.tb_school), "Hogwarts");
        solo.enterText((EditText) solo.getView(R.id.tb_first_name), "Harry");
        solo.enterText((EditText) solo.getView(R.id.tb_last_name), "Potter");
        solo.enterText((EditText) solo.getView(R.id.tb_city), "London");
        solo.enterText((EditText) solo.getView(R.id.tb_country), "England");
        solo.enterText((EditText) solo.getView(R.id.tb_courses), "Defense Against the Dark Arts, Potions");
        solo.enterText((EditText) solo.getView(R.id.tb_dob), "1995-07-04");
        solo.clickOnButton("Save");
        assertTrue(solo.waitForText("1995-07-04"));
    }

    public void testEmptySave() throws Exception {
        solo.enterText((EditText) solo.getView(R.id.tb_dob), "1994-07-04");
        solo.clickOnButton("Save");
        assertTrue(solo.waitForText("1994-07-04"));
    }

    public void testInvalidDate() throws Exception {
        solo.enterText((EditText) solo.getView(R.id.tb_dob), "19974-07-04");
        solo.clickOnButton("Save");
        assertTrue(solo.waitForText("Invalid date"));
        solo.clearEditText((EditText) solo.getView(R.id.tb_dob));
        solo.enterText((EditText) solo.getView(R.id.tb_dob), "1994/07/04");
        solo.clickOnButton("Save");
        assertTrue(solo.waitForText("Invalid date"));
    }

    @Override
    public void tearDown() throws Exception {
        solo.finishOpenedActivities();
    }
}