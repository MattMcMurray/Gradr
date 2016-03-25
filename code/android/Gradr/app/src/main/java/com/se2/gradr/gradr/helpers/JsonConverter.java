package com.se2.gradr.gradr.helpers;

import com.se2.gradr.gradr.Message;
import com.se2.gradr.gradr.Rating;
import com.se2.gradr.gradr.User;

import org.json.JSONException;
import org.json.JSONObject;

/**
 * Created by steve on 08/03/16.
 */
public class JsonConverter {
    // So apparently, if we do json.getString(fieldname) on a field that doesn't
    // exist, it throws an exception instead of just returning null. So we'll have to go
    // through and get each field individually...
    public static User userFromJson(JSONObject json) throws JSONException {
        if (!json.has("username") || !json.has("id")) {
            System.out.println("ERROR - Potential match doesn't have username/userID");
            return null;
        }

        String firstname = "";
        if (json.has("firstname")) {
            firstname = json.getString("firstname");
        }
        String lastname = "";
        if (json.has("lastname")) {
            lastname = json.getString("lastname");
        }
        String city = "";
        if (json.has("city")) {
            city = json.getString("city");
        }
        String country = "";
        if (json.has("country")) {
            country = json.getString("country");
        }
        String school = "";
        if (json.has("school")) {
            school = json.getString("school");
        }
        String courses = "";
        if (json.has("courses")) {
            courses = json.getString("courses");
        }
        String generalDescription = "";
        if (json.has("generalDescription")) {
            generalDescription = json.getString("generalDescription");
        }
        String helpDescription = "";
        if (json.has("helpDescription")) {
            helpDescription = json.getString("helpDescription");
        }

        User user = new User(json.getString("username"),
                json.getInt("id"), firstname, lastname, city,
                country, school, courses, generalDescription, helpDescription);
        return user;
    }

    public static Rating ratingFromJson (JSONObject json) throws JSONException {
        if (!json.has("rating")) {
            System.out.println("ERROR - Rating doesn't contain a number");
        }
        String comment = "";
        if (json.has("comment")) {
            comment = json.getString("comment");
        }

        Rating rating = new Rating(comment, json.getInt("rating"));
        return rating;
    }

    public static Message messageFromJson(JSONObject json) throws Exception {
        if (!json.has("message") || !json.has("createdAt") || !json.has("sender") || !json.has("receiver")) {
            System.out.println("ERROR - Message doesn't contain proper data");
        }

        Message message = new Message(json.getString("message"), json.getString("sender"), json.getString("receiver"), json.getString("createdAt"));

        return message;
    }
}
