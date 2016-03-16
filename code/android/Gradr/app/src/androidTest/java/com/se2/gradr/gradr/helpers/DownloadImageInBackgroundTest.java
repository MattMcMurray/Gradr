package com.se2.gradr.gradr.helpers;

import android.graphics.Bitmap;
import android.widget.ImageView;

import com.google.mockwebserver.MockWebServer;
import com.se2.gradr.gradr.UserAndImage;

import junit.framework.TestCase;

public class DownloadImageInBackgroundTest extends TestCase {
    private MockWebServer mServer;
    private DownloadImageInBackground download;
    private String url;
    private UserAndImage uai;
    private Bitmap bmp = Bitmap.createBitmap(100,100, Bitmap.Config.ARGB_8888);

    public void setUp() throws Exception {
        mServer = new MockWebServer();
        mServer.play();
        uai = new UserAndImage(null);
        url = "http://thecatapi.com/api/images/get?format=src&type=jpg&size=small46";
        download = new DownloadImageInBackground(url, uai);
    }

    public void testDoInBackground() throws Exception {
        ImageView iview = new ImageView(null);
    }
}