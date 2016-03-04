package com.se2.gradr.gradr;

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
import android.webkit.WebView;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.TextView;

import com.wenchao.cardstack.CardStack;

import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;

public class SwipeActivity extends AppCompatActivity {

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

        stackOCards.setAdapter(adapter);

        //Stuff that was already there when I made the activity. Might want to revisit it.
//        setContentView(R.layout.swipe_activity);
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
