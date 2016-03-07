package com.se2.gradr.gradr;

import android.animation.Animator;
import android.animation.AnimatorListenerAdapter;
import android.annotation.TargetApi;
import android.app.Dialog;
import android.content.Context;
import android.database.DataSetObserver;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.AsyncTask;
import android.os.Build;
import android.os.Bundle;
import android.provider.ContactsContract;
import android.support.design.widget.FloatingActionButton;
import android.support.design.widget.Snackbar;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.webkit.WebView;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import com.wenchao.cardstack.CardStack;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Observable;
import java.util.Observer;

public class SwipeActivity extends AppCompatActivity {

    TextView passText;
    TextView failText;
    CardsDataAdapter adapter;

    private View mProgressView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.swipe_activity);

        //Initialize the card view
        CardStack stackOCards = (CardStack) findViewById(R.id.container);
        stackOCards.setContentResource(R.layout.card_layout);
        stackOCards.setStackMargin(20);

        //ArrayAdapter to pass to the card stack
        ArrayAdapterObserver obs = new ArrayAdapterObserver();
        adapter = new CardsDataAdapter(getApplicationContext());
        adapter.setNotifyOnChange(true);
        adapter.registerDataSetObserver(obs);
        stackOCards.setAdapter(adapter);

        //Observes how many cards we have, makes API call when needed
        SwipeListener listener = new SwipeListener();
        listener.addObserver(obs);
        stackOCards.setListener(listener);

        //Get these views so that we can use them in the SwipeListener
        passText = (TextView) findViewById(R.id.passView);
        failText = (TextView) findViewById(R.id.failView);

        //Find the loading icon and then load the first batch of users
        mProgressView = findViewById(R.id.load_progress);
        loadBatch();


        //Stuff that was already there when I made the activity. Might want to revisit it.
//        Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
//        setSupportActionBar(toolbar);
//
//        FloatingActionButton fab = (FloatingActionButton) findViewById(R.id.fab);
//        fab.setOnClickListener(new View.OnClickListener() {
//            @Override
//            public void onClick(View view) {
//                Snackbar.make(view, "Replace with your own action", Snackbar.LENGTH_LONG)
//                        .setAction("Action", null).show();
//            }
//        });
    }

    public void loadBatch() {
        showProgress(true);
        new GetPotentialTask(207).execute();
    }

    /**
     * Shows the progress UI and hides the login form.
     */
    @TargetApi(Build.VERSION_CODES.HONEYCOMB_MR2)
    private void showProgress(final boolean show) {
        // On Honeycomb MR2 we have the ViewPropertyAnimator APIs, which allow
        // for very easy animations. If available, use these APIs to fade-in
        // the progress spinner.
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.HONEYCOMB_MR2) {
            int shortAnimTime = getResources().getInteger(android.R.integer.config_shortAnimTime);

            mProgressView.setVisibility(show ? View.VISIBLE : View.GONE);
            mProgressView.animate().setDuration(shortAnimTime).alpha(
                    show ? 1 : 0).setListener(new AnimatorListenerAdapter() {
                @Override
                public void onAnimationEnd(Animator animation) {
                    mProgressView.setVisibility(show ? View.VISIBLE : View.GONE);
                }
            });
        } else {
            // The ViewPropertyAnimator APIs are not available, so simply show
            // and hide the relevant UI components.
            mProgressView.setVisibility(show ? View.VISIBLE : View.GONE);
        }
    }

    public class CardsDataAdapter extends ArrayAdapter<User> {

        public CardsDataAdapter(Context context) {
            super(context, R.layout.card_layout);
        }

        @Override
        public View getView(int position, final View contentView, ViewGroup parent){
            //Get images loading on background thread
            ImageView imageView = (ImageView) contentView.findViewById(R.id.userImage);
            String url = getString(R.string.cat_api_url) + Math.random();
            new DownloadImageInBackground(url).execute(imageView);

            User user = getItem(position);
            TextView v =(TextView) (contentView.findViewById(R.id.username));
            v.setText(user.getUsername());
            v = (TextView)(contentView.findViewById(R.id.name));
            v.setText(user.getFirstName() + " " + user.getLastName());

            return contentView;
        }

    }

    public class SwipeListener extends Observable implements CardStack.CardEventListener {
//        Toast myToast = null;//Toast is not the right thing here. Need alternative

        @Override
        public boolean swipeStart(int direction, float distance) {
            return true;
        }

        @Override
        public void discarded(int id, int direction) {
            //When the top card gets dropped but not off screen so it goes back to the top of the stack
        }

        @Override
        public void topCardTapped() {
            //When you tap the top card
        }

        @Override
        public boolean swipeContinue(int direction, float distX, float distY) {

            if (direction % 2 == 0) {
                failText.setVisibility(View.VISIBLE);
                passText.setVisibility(View.GONE);
                failText.setTextSize(distX/7);
            } else {
                failText.setVisibility(View.GONE);
                passText.setVisibility(View.VISIBLE);
                passText.setTextSize(distX / 7);
            }
            return true;
        }

        /**
         * //there are four directions
         //  0  |  1
         // ----------
         //  2  |  3
         * @param direction which one of those directions was swiped.
         * @param distance how far into each quadrant the card went
         * @return true is the card is dismissed. false otherwise
         */
        @Override
        public boolean swipeEnd(int direction, float distance) {
            passText.setVisibility(View.GONE);
            failText.setVisibility(View.GONE);
            if (distance <= 500) {
                return false; //Didn't swipe far enough
            }

            //Tell the observer in case we need to get a new batch
            this.setChanged();
            this.notifyObservers();

            if (direction % 2 == 0) { //If it's on the left
                //Do rejection things
            } else { //On the right
                //Do match things
            }
            return true;
        }
    }

    public class ArrayAdapterObserver extends DataSetObserver implements Observer {
        private int totalPotentials = 0;

        public ArrayAdapterObserver() {
            super();
            Log.d("DS", "CREATED");
            System.out.print("CREATED OBSERVER");
        }

        //Called when Users are added to the ArrayAdapter
        @Override
        public void onChanged() {
            Log.d("DS", "ADDED");
            System.out.print("CHANGED");
            totalPotentials++;
        }

        //Called when Swipes occur
        @Override
        public void update(Observable observable, Object object) {
            Log.d("DS", "SWIPED");
            totalPotentials--;
            if (totalPotentials == 0) {
                loadBatch();
            }
        }
    }

    /**
     * Asynchronously fetch a batch of users to attempt to match with next
     */
    public class GetPotentialTask extends AsyncTask<Void, Void, User[]> {

        private int userId;
        private final int batchSize = 4;

        GetPotentialTask(int userId) {
            this.userId = userId;
        }

        @Override
        protected void onPostExecute(final User[] users) {
            System.out.println("HERE2");
            if (users != null) {
                System.out.println("ADDING NEW ONES");
                for (int i = 0; i < users.length; i++) {
                    adapter.add(users[i]);
                }

            } else {
                System.out.println("NULL USER");
            }
            showProgress(false);
        }

        @Override
        protected User[] doInBackground(Void... params) {

            String stringUrl = getString(R.string.http_address_server) + "/api/userBatch?currUserId=" + userId + "&batchSize=" + batchSize;

            try {
                JSONObject json = GetRequester.doAGetRequest(stringUrl);
                if (json == null) {
                    System.out.println("JSON was null");
                    return null;
                }
                JSONArray usersJson = json.getJSONArray("users");
                User[] users = new User[usersJson.length()];
                for (int i = 0; i < usersJson.length(); i++) {
                    users[i] = userFromJson((JSONObject)usersJson.get(i));
                    System.out.println(users[i].toString());
                }
                return users;

            } catch (Exception e) {
                System.out.println("ERROR while parsing randomUser");
                System.out.println(e.toString());
                e.printStackTrace();
            }

            return null;
        }

        // So apparently, if we do json.getString(fieldname) on a field that doesn't
        // exist, it throws an exception instead of just returning null. So we'll have to go
        // through and get each field individually...
        public User userFromJson(JSONObject json) throws JSONException {
            if (!json.has("username") || !json.has("id")) {
                System.out.println("ERROR - Potential match doesn't have username/userID");
                return null;
            }

            String firstname = "";
            if (json.has("firstname")) {
                firstname = json.getString("firstname");
            }
            String lastname = "";
            if (json.has("lastname")) {
                firstname = json.getString("lastname");
            }
            String city = "";
            if (json.has("city")) {
                firstname = json.getString("city");
            }
            String country = "";
            if (json.has("country")) {
                firstname = json.getString("country");
            }
            String school = "";
            if (json.has("school")) {
                firstname = json.getString("school");
            }
            String courses = "";
            if (json.has("courses")) {
                firstname = json.getString("courses");
            }
            String generalDescription = "";
            if (json.has("generalDescription")) {
                firstname = json.getString("generalDescription");
            }
            String helpDescription = "";
            if (json.has("helpDescription")) {
                firstname = json.getString("helpDescription");
            }

            User user = new User(json.getString("username"),
                    json.getInt("id"), firstname, lastname, city,
                    country, school, courses, generalDescription, helpDescription);
            return user;
        }
    }
}
