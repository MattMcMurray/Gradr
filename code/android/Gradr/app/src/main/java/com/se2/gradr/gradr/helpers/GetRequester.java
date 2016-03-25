package com.se2.gradr.gradr.helpers;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;

/**
 * Created by steve on 06/03/16.
 */
public class GetRequester {

    public static JSONObject doAGetRequest(String stringUrl) throws MalformedURLException, IOException, JSONException {
        URL url = new URL(stringUrl);
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();

        StringBuilder stringBuilder = new StringBuilder();
        int httpRes = connection.getResponseCode();
        if (httpRes == HttpURLConnection.HTTP_OK) {
            BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream(), "utf-8"));
            String line = null;
            while ((line = reader.readLine()) != null) {
                stringBuilder.append(line);
            }
            reader.close();

            System.out.println("" + stringBuilder.toString());

            return new JSONObject(stringBuilder.toString());
        } else {
            throw new IOException("httpConnection error\n" + httpRes + " - "+ connection.getResponseCode());
        }
    }
}
