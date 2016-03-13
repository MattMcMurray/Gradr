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

import com.se2.gradr.gradr.helpers.PostRequester;

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

        String username = "";
        String password = "";
        String confirmPassword = "";
        new RegisterAccountHelper(username,password,confirmPassword).execute();
        finish();
    }

    /**
     * Asynchronously send a POST request containing info about whether or not the users matched
     */
    public class RegisterAccountHelper extends AsyncTask<String, Void, Void> {
        private String username;
        private String password;
        private String confirmPassword;

        RegisterAccountHelper(String username, String password, String confirmPassword) {
            this.username = username;
            this.password = password;
            this.confirmPassword = confirmPassword;
        }

        @Override
        protected Void doInBackground(String... params) {
            String stringUrl = getString(R.string.http_address_server) + "/api/NewUser?username=" + username + "&password=" + password + "&confirmPassword=" + confirmPassword;
            try {
                JSONObject postParams = new JSONObject();
                postParams.put("username", username);
                postParams.put("password", password);
                postParams.put("confirmPassword", confirmPassword);

                JSONObject json = PostRequester.doAPostRequest(stringUrl, postParams);
                if (json == null) {
                    System.out.println("JSON was null for registering new user");
                }
            } catch (Exception e) {
                System.out.println("ERROR while registering new user");
                System.out.println(e.toString());
                e.printStackTrace();
            }

            return null;
        }
    }

}
