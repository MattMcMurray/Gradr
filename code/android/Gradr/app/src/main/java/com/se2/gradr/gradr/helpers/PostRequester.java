package com.se2.gradr.gradr.helpers;

import android.os.AsyncTask;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;

/**
 * Created by steve on 07/03/16.
 */

//Basically, pass in the URL and the parameters as a JSONObject, and this returns the JSONObject results.
//Will throw an IOException if it doesn't work
public class PostRequester {
    public static String doAPostRequest(String stringUrl, JSONObject params) throws MalformedURLException, IOException, JSONException {
        java.net.URL url = new URL(stringUrl);
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        connection.setDoOutput(true);
        connection.setDoInput(true);
        connection.setRequestProperty("Content-Type", "application/json");
        connection.setRequestProperty("Accept", "application/json");
        connection.setRequestMethod("POST");

        OutputStreamWriter wr = new OutputStreamWriter(connection.getOutputStream());
        wr.write(params.toString());
        wr.flush();

        StringBuilder stringBuilder = new StringBuilder();
        int httpRes = connection.getResponseCode();
        if(httpRes != HttpURLConnection.HTTP_OK) {
            throw new IOException("httpConnection error\n" + httpRes + " - "+ connection.getResponseCode());
        }
        BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream(),"utf-8"));
        String line = null;

        while ((line = reader.readLine()) != null) {
            stringBuilder.append(line);
        }
        reader.close();
        System.out.println(""+stringBuilder.toString());


        return stringBuilder.toString();

    }

}
