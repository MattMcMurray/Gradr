package com.se2.gradr.gradr;

import android.app.Dialog;
import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.AsyncTask;
import android.os.Bundle;
import android.support.design.widget.FloatingActionButton;
import android.support.design.widget.Snackbar;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.webkit.WebView;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import com.wenchao.cardstack.CardStack;

import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;

public class SwipeActivity extends AppCompatActivity {

    TextView passText;
    TextView failText;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.swipe_activity);

        CardStack stackOCards = (CardStack) findViewById(R.id.container);
        stackOCards.setContentResource(R.layout.card_layout);
        stackOCards.setStackMargin(20);

        CardsDataAdapter adapter = new CardsDataAdapter(getApplicationContext());
        User newUser = new User("tommyj", 1, "tommy", "John", "Winnipeg", "Canada", "UManitoba", "COMP 4380", "I'm uncool", "I need help with my one class");
        adapter.add(newUser);
        User secondUser = new User("abigail", 2, "Abby", "Wombach", "Winnipeg", "Canada", "UManitoba", "PERS 1500", "We like sports and we don't care who knows", "I need help with my one class");
        adapter.add(secondUser);

        SwipeListener listener = new SwipeListener();
        stackOCards.setAdapter(adapter);
        stackOCards.setListener(listener);

        //Get these views so that we can use them in the SwipeListener
        passText = (TextView) findViewById(R.id.passView);
        failText = (TextView) findViewById(R.id.failView);

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
            TextView v = (TextView)(contentView.findViewById(R.id.name));
            v.setText(user.getFirstName() + " " + user.getLastName());

            return contentView;
        }

    }

    public class SwipeListener implements CardStack.CardEventListener {
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
                passText.setTextSize(distX/7);
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
            if (distance <= 300) {
                return false; //Didn't swipe far enough
            }

            if (direction % 2 == 0) { //If it's on the left
                //Do rejection things
            } else { //On the right
                //Do match things
            }
            return true;
        }
    }

    public class DownloadImageInBackground extends AsyncTask<ImageView, Void, Bitmap> {
        ImageView imageView = null;
        String url;

        public DownloadImageInBackground(String url) {
            this.url = url;
        }

        @Override
        protected void onPostExecute(Bitmap downloadedImage) {
            imageView.setImageBitmap(downloadedImage);
        }

        @Override
        protected Bitmap doInBackground(ImageView... imageViews) {
            this.imageView = imageViews[0];
            return download(url);
        }

        protected Bitmap download(String url) {
            Bitmap result =null;
            try{
                URL theUrl = new URL(url);
                HttpURLConnection con = (HttpURLConnection)theUrl.openConnection();
                InputStream is = con.getInputStream();
                result = BitmapFactory.decodeStream(is);
                if (null != result)
                    return result;

            } catch(Exception e) {
                System.out.print("ERRROR FOR IMAGE AT URL " + url);
            }
            return result;
        }
    }

}
