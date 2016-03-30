package com.se2.gradr.gradr;

import android.app.AlertDialog;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.AsyncTask;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.TextView;

import com.se2.gradr.gradr.helpers.DownloadImageInBackground;
import com.se2.gradr.gradr.helpers.GetRequester;
import com.se2.gradr.gradr.helpers.JsonConverter;
import com.se2.gradr.gradr.helpers.PostRequester;
import com.wenchao.cardstack.CardStack;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Observable;
import java.util.Observer;

public class SwipeActivity extends AppCompatActivity {

    Toolbar toolbar;

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
        ThemeSelector.onActivityChangeTheme(this);
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
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.main_menu, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {

        int id = item.getItemId();

        if (id == R.id.action_logout) {
            Intent logoutIntent = new Intent(this, LoginActivity.class);
            logoutIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
            startActivity(logoutIntent);
        } else if (id == R.id.action_matches) {
            Intent matchesIntent = new Intent(this, MatchListActivity.class);
            matchesIntent.putExtra("username", username);
            matchesIntent.putExtra("id", userId);
            startActivity(matchesIntent);
        } else if (id == R.id.action_theme) {
            ThemeSelector.showThemeDialog(this);
        } else if (id == R.id.action_profile) {
            Intent profileIntent = new Intent(this, ProfileActivity.class);
            profileIntent.putExtra("username", username);
            profileIntent.putExtra("id", userId);
            startActivity(profileIntent);
        } else if (id == R.id.action_leaders) {
            Intent leaderIntent = new Intent(this, LeaderBoardActivity.class);
            leaderIntent.putExtra("username", username);
            leaderIntent.putExtra("id", userId);
            startActivity(leaderIntent);
        }

        return super.onOptionsItemSelected(item);
    }

    public class CardsDataAdapter extends ArrayAdapter<User> {

        public CardsDataAdapter(Context context) {
            super(context, R.layout.card_layout);
        }

        @Override
        public View getView(int position, final View contentView, ViewGroup parent){
            //Get images loading on background thread
            User user = getItem(position);
            ImageView imageView = (ImageView) contentView.findViewById(R.id.userImage);
            String url = getString(R.string.cat_api_url) + Math.random();
            new ImageDownloader(url).execute(imageView);

            //Set the values on the User's card
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
            if (direction % 2 == 0) { //If it's on the left
                new UserMatchHelper(userId).execute("dislikeUser", "" + likeeId);
            } else { //On the right
                new UserMatchHelper(userId).execute("likeUser", "" + likeeId);
            }
            this.setChanged();
            this.notifyObservers();
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
                    users[i] = JsonConverter.userFromJson((JSONObject) usersJson.get(i));
                }
                return users;

            } catch (Exception e) {
//                new AlertDialog.Builder(getApplicationContext()).setMessage("This current build only works when you have a server running. You probably got a 404 because the userBatch function isn't on AWS yet.").show();
                System.out.println("ERROR while parsing randomUser");
                System.out.println(e.toString());
                e.printStackTrace();
            }

            return null;
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

                String jsonString = PostRequester.doAPostRequest(stringUrl, postParams);
                JSONObject json = new JSONObject(jsonString);
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


    ///////////////////////////////////////////////////////////////////////////////////////////////
    //Unfortunately, the Swipe Cards repo that we're using isn't as flexible as originally anticipated
    //This function class is specific to the CardStack. For all other image pages, use
    //the class DownloadImageInBackground
    public class ImageDownloader extends AsyncTask<ImageView, Void, Bitmap> {
        private ImageView imageView = null;
        private String url;

        public ImageDownloader(String url) {
            this.url = url;
        }

        @Override
        protected void onPostExecute(Bitmap downloadedImage) {
            imageView.setImageBitmap(downloadedImage);
        }

        @Override
        protected Bitmap doInBackground(ImageView... imageViews) {
            this.imageView = imageViews[0];
            Bitmap result = download(url);
            return result;
        }

        protected Bitmap download(String url) {
            Bitmap result =null;
            try {
                URL theUrl = new URL(url);
                HttpURLConnection con = (HttpURLConnection)theUrl.openConnection();
                InputStream is = con.getInputStream();
                BitmapFactory.Options options = new BitmapFactory.Options();
                options.inSampleSize = 6;
                result = BitmapFactory.decodeStream(is, null, options);
                if (null != result)
                    return result;

            } catch(Exception e) {
                System.out.println("ERRROR FOR IMAGE AT URL " + url);
                System.out.println(e.toString());
            }
            return result;
        }
    }

}
