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
        // Build Response JSON Object
        JSONObject expectedResponse = new JSONObject();
        try {
            expectedResponse.put("status", "OK");
        } catch (JSONException e) {
            Log.e("EXCEPTION", "Exception thrown in GetRequestTest: " + e.getMessage());
        }


        // Build fake HTTP response
        RecordedRequest req = null;
        MockResponse mockResponse = new MockResponse()
                .addHeader("Content-Type", "application/json; charset=utf-8")
                .addHeader("Cache-Control", "no-cache")
                .setBody(expectedResponse.toString())
                .setResponseCode(200);

        // Add the response to the mock server's queue
        mServer.enqueue(mockResponse);

        String reqUrlString = mServer.getUrl("/").toString();
        try {
            // Send the request and get the response
            response = GetRequester.doAGetRequest(reqUrlString);
            req = mServer.takeRequest();
        } catch (Exception e) {
            Log.e("EXCEPTION", "Exception thrown in GetRequestTest: " + e.getMessage());
        }

        // Assert response is as expected
        assertNotNull(req);
        assertEquals("GET", req.getMethod());
        assertNotNull(response);
        assertEquals(expectedResponse.toString(), response.toString());
    }
}
