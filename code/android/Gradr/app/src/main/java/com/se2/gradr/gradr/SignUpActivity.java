package com.se2.gradr.gradr;

import android.os.AsyncTask;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;
import android.view.KeyEvent;
import android.view.View;
import android.view.inputmethod.EditorInfo;
import android.widget.AutoCompleteTextView;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

import org.json.JSONObject;

/**
 * Created by Caleb on 3/7/2016.
 */
public class SignUpActivity extends LoginActivity {

    // UI references.
    private AutoCompleteTextView mEmailView;
    private EditText mPasswordView;
    private View mProgressView;
    private View mLoginFormView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.signup_activity);

        // Set up the signup form.

        Button mCancelButton = (Button) findViewById(R.id.cancel_button);
        mCancelButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                cancelRegistration();
            }
        });

        Button mRegisterButton = (Button) findViewById(R.id.register_button);
        mRegisterButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                attemptRegistration();
            }
        });
    }

    /*
    Closes activity, revealing previous login activity, which is still open
     */

    private void cancelRegistration() {
        finish();
    }

    private void attemptRegistration() {



        String mUsername = "rob";
        String mPassword = "pixel";
        String mConfirmPassword = "pixel";

        String stringUrl = getString(R.string.http_address_server) + "/api/NewUser";

        try {
            JSONObject credentials = new JSONObject();
            credentials.put("username", mUsername);
            credentials.put("password", mPassword);
            credentials.put("confirmPassword", mConfirmPassword);

            JSONObject json = PostRequester.doAPostRequest(stringUrl, credentials);

            String username = json.getJSONObject("user").getString("username");
            String id = json.getJSONObject("user").getString("id");
            System.out.println(username + " " + id);

            finish();
        } catch (Exception e) {
            System.out.println("ERROR ON REGISTRATION " + e.toString());
        }

    }

}
