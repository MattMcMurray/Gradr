package com.se2.gradr.gradr;

import android.animation.Animator;
import android.animation.AnimatorListenerAdapter;
import android.annotation.TargetApi;
import android.app.AlertDialog;
import android.app.Dialog;
import android.content.Context;
import android.content.Intent;
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
import android.util.AttributeSet;
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
import java.util.jar.Attributes;

public class SwipeActivity extends AppCompatActivity {


    private String username;
    private int userId;

    private TextView passText;
    private TextView failText;
    private CardsDataAdapter adapter;
    private CardStack stackOCards;
    private SwipeListener listener;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.swipe_activity);

        Intent starter = getIntent();
        userId = starter.getIntExtra("id", -1);
        username = starter.getStringExtra("username");
        if (username == null || username.length() < 1 || userId < 0) {
            finish(); //Basically, we kill the app.
        }

        //Initialize the card view
        stackOCards = (CardStack) findViewById(R.id.container);
        stackOCards.setContentResource(R.layout.card_layout);
        stackOCards.setStackMargin(20);

        //ArrayAdapter to pass to the card stack
        ArrayAdapterObserver obs = new ArrayAdapterObserver();
        adapter = new CardsDataAdapter(getApplicationContext());
        adapter.setNotifyOnChange(true);
        stackOCards.setAdapter(adapter);

        //Observes how many cards we have, makes API call when needed
        listener = new SwipeListener();
        listener.addObserver(obs);
        stackOCards.setListener(listener);

        //Get these views so that we can use them in the SwipeListener
        passText = (TextView) findViewById(R.id.passView);
        failText = (TextView) findViewById(R.id.failView);

        new GetPotentials(userId).execute();


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
            if (distance <= 400) {
                return false; //Didn't swipe far enough
            }

            int likeeId = adapter.getItem(stackOCards.getCurrIndex()).getId();

            //Tell the observer in case we need to get a new batch
            this.setChanged();
            this.notifyObservers();
            System.out.println("Notified?");
            if (direction % 2 == 0) { //If it's on the left
                new UserMatchHelper(userId).execute("dislikeUser", "" + likeeId);
            } else { //On the right
                new UserMatchHelper(userId).execute("likeUser", "" + likeeId);
            }
            return true;
        }
    }

    public class ArrayAdapterObserver implements Observer {
//        private int totalPotentials = 0;

        //Called when Swipes occur
        @Override
        public void update(Observable observable, Object object) {
            if (stackOCards.getCurrIndex() == adapter.getCount()-1) {
                adapter.clear();

                new GetPotentials(userId).execute();
            }
        }
    }

    /**
     * Asynchronously fetch a batch of users to attempt to match with next
     */
    public class GetPotentials extends AsyncTask<Void, Void, User[]> {

        private int userId;
        private final int batchSize = 4;

        GetPotentials(int userId) {
            this.userId = userId;
        }

        @Override
        protected void onPostExecute(final User[] users) {
            if (users != null) {
                stackOCards.reset(true); //This resets the index of the stack. It does not reset the ArrayAdapter
                stackOCards.setListener(listener); //This needs to be set again because everything is reset by the reset call

                for (int i = 0; i < users.length; i++) {
                    adapter.add(users[i]);
                }

            } else {
                System.out.println("NULL USER");
            }
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
                new AlertDialog.Builder(getApplicationContext()).setMessage("This current build only works when you have a server running. You probably got a 404 because the userBatch function isn't on AWS yet.").show();
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

    /**
     * Asynchronously send a POST request containing info about whether or not the users matched
     */
    public class UserMatchHelper extends AsyncTask<String, Void, Void> {
        private int likerId;

        UserMatchHelper(int userId) {
            this.likerId = userId;
        }

        /*
            params[0] should be either likeUser or dislikeUser
            params[1] should be a String of the likee's userID
         */
        @Override
        protected Void doInBackground(String... params) {
            String stringUrl = getString(R.string.http_address_server) + "/api/" + params[0] + "?liker_id=" + likerId + "&likee_id=" + params[1];
            try {
                JSONObject postParams = new JSONObject();
                postParams.put("liker_id", likerId);
                postParams.put("likee_id", params[1]);

                JSONObject json = PostRequester.doAPostRequest(stringUrl, postParams);
                if (json == null) {
                    System.out.println("JSON was null for like/dislike");
                }
            } catch (Exception e) {
                System.out.println("ERROR while parsing randomUser");
                System.out.println(e.toString());
                e.printStackTrace();
            }

            return null;
        }
    }

}
