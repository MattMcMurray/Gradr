package com.se2.gradr.gradr.helpers;

import android.util.Log;

import com.google.mockwebserver.MockResponse;
import com.google.mockwebserver.MockWebServer;
import com.google.mockwebserver.RecordedRequest;

import junit.framework.TestCase;

import org.json.JSONException;
import org.json.JSONObject;

public class GetRequesterTest extends TestCase {
    private MockWebServer mServer;
    private JSONObject response;

    public void setUp() throws Exception {
        mServer = new MockWebServer();
        mServer.play();
    }

    public void tearDown() throws Exception {
        mServer.shutdown();
    }

    public void testGetRequester() {

        MockResponse mockResponse = new MockResponse()
                .addHeader("Content-Type", "application/json; charset=utf-8")
                .addHeader("Cache-Control", "no-cache")
                .setBody("{status: 'OK'}")
                .setResponseCode(200);

        mServer.enqueue(mockResponse);

        String reqUrlString = mServer.getUrl("/").toString();
        try {
            Log.d("DEBUG", "Placing GET request");
            response = GetRequester.doAGetRequest(reqUrlString);
            RecordedRequest req = mServer.takeRequest();
        } catch (Exception e) {
            Log.e("EXCEPTION", "Exception thrown in GetRequestTest: " + e.getMessage());
        }

        Log.d("JSON Response", response.toString());
    }
}
