package com.se2.gradr.gradr.helpers;

import android.util.Log;

import com.google.mockwebserver.MockResponse;
import com.google.mockwebserver.MockWebServer;
import com.google.mockwebserver.RecordedRequest;

import junit.framework.TestCase;

import org.json.JSONException;
import org.json.JSONObject;

public class PostRequesterTest extends TestCase{
    private MockWebServer mServer;
    private JSONObject response;
    private JSONObject expectedResponse = new JSONObject();
    private JSONObject sendData = new JSONObject();
    private RecordedRequest req = null;

    public void setUp() throws Exception {
        mServer = new MockWebServer();
        mServer.play();

        try {
            expectedResponse.put("status", "OK");
            sendData.put("username", "test_name");
            sendData.put("message", "hello");
        } catch (JSONException e) {
            Log.e("EXCEPTION", "Exception thrown in PostRequesterTest: " + e.getMessage());
        }

        // Build fake HTTP response
        MockResponse mockResponse = new MockResponse()
                .addHeader("Content-Type", "application/json; charset=utf-8")
                .addHeader("Cache-Control", "no-cache")
                .setBody(expectedResponse.toString())
                .setResponseCode(200);

        // Add the response to the mock server's queue
        mServer.enqueue(mockResponse);
    }

    public void tearDown() throws Exception {
        mServer.shutdown();
    }

    public void testPostRequester() {
        String reqUrlString = mServer.getUrl("/").toString();
        try {
            response = PostRequester.doAPostRequest(reqUrlString, sendData);
            req = mServer.takeRequest();
        } catch (Exception e) {
            Log.e("EXCEPTION", "Exception thrown in PostRequesterTest:" + e.getMessage());
        }

        assertNotNull(req);
        assertEquals("POST", req.getMethod());
        assertNotNull(response);
        assertEquals(expectedResponse.toString(), response.toString());
    }
}
