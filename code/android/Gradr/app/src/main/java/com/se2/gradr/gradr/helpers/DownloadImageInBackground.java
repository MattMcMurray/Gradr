package com.se2.gradr.gradr.helpers;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.AsyncTask;
import android.widget.ImageView;

import com.se2.gradr.gradr.User;

import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;

/**
 * Created by steve on 06/03/16.
 */
public class DownloadImageInBackground extends AsyncTask<ImageView, Void, Bitmap> {
    ImageView imageView = null;
    String url;
    User user;

    public DownloadImageInBackground(String url, User user) {
        this.url = url;
        this.user = user;
    }

    @Override
    protected void onPostExecute(Bitmap downloadedImage) {
        imageView.setImageBitmap(downloadedImage);
    }

    @Override
    protected Bitmap doInBackground(ImageView... imageViews) {
        this.imageView = imageViews[0];
        Bitmap result = download(url);
        user.setBmp(result);
        return result;
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
            System.out.println("ERRROR FOR IMAGE AT URL " + url);
            System.out.println(e.toString());
        }
        return result;
    }
}