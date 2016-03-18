package com.se2.gradr.gradr.helpers;

import junit.framework.TestCase;

import com.se2.gradr.gradr.User;
import com.se2.gradr.gradr.Message;
import com.se2.gradr.gradr.Rating;

import org.json.JSONObject;

public class JsonConverterTest extends TestCase {
    JSONObject jsonFull, jsonEmpty, jsonMissing1, jsonMissing2;
    JSONObject jsonRatingFull, jsonRatingMissing, jsonRatingEmpty;
    JSONObject jsonMessageFull, jsonMessageMissing;

    public void setUp() throws Exception {
        jsonFull = new JSONObject();
        jsonFull.put("id", 402);
        jsonFull.put("username", "KeaneK");
        jsonFull.put("firstname", "Keane");
        jsonFull.put("lastname", "Kraus");
        jsonFull.put("city", "Winnipeg");
        jsonFull.put("country", "Canada");
        jsonFull.put("school", "UofM");
        jsonFull.put("courses", "COMP4350");
        jsonFull.put("generalDescription", "Gamer");
        jsonFull.put("helpDescription", "Help");

        jsonEmpty = new JSONObject();
        jsonEmpty.put("id", 403);
        jsonEmpty.put("username", "KeaneKK");

        jsonMissing1 = new JSONObject();
        jsonMissing1.put("id", 404);

        jsonMissing2 = new JSONObject();
        jsonMissing2.put("username", "KeaneKKK");

        jsonRatingFull = new JSONObject();
        jsonRatingFull.put("rating", "5");
        jsonRatingFull.put("comment", "star");

        jsonRatingMissing = new JSONObject();
        jsonRatingMissing.put("rating", "3");

        jsonRatingEmpty = new JSONObject();

        jsonMessageFull = new JSONObject();
        jsonMessageFull.put("message", "Hi");
        jsonMessageFull.put("createdAt", "2016-03-03T10:35:35");
        jsonMessageFull.put("sender", "205");
        jsonMessageFull.put("receiver", "201");

        jsonMessageMissing = new JSONObject();
        jsonMessageMissing.put("message", "Bye");
        jsonMessageMissing.put("sender", "201");
    }

    public void testUserFromJsonFull() throws Exception {
        User test = JsonConverter.userFromJson(jsonFull);
        assertTrue(test.toString().equals("KeaneK402"));
        assertTrue(test.getFirstName().equals("Keane"));
        assertTrue(test.getUsername().equals("KeaneK"));
        assertTrue(test.getId() == 402);
        assertTrue(test.getLastName().equals("Kraus"));
        assertTrue(test.getCity().equals("Winnipeg"));
        assertTrue(test.getCountry().equals("Canada"));
        assertTrue(test.getSchool().equals("UofM"));
        assertTrue(test.getCourses().equals("COMP4350"));
        assertTrue(test.getGeneralDescription().equals("Gamer"));
        assertTrue(test.getHelpDescription().equals("Help"));
    }

    public void testUserFromJsonEmpty() throws Exception {
        User test = JsonConverter.userFromJson(jsonEmpty);
        assertTrue(test.toString().equals("KeaneKK403"));
        assertTrue(test.getFirstName().equals(""));
        assertTrue(test.getUsername().equals("KeaneKK"));
        assertTrue(test.getId() == 403);
        assertTrue(test.getLastName().equals(""));
        assertTrue(test.getCity().equals(""));
        assertTrue(test.getCountry().equals(""));
        assertTrue(test.getSchool().equals(""));
        assertTrue(test.getCourses().equals(""));
        assertTrue(test.getGeneralDescription().equals(""));
        assertTrue(test.getHelpDescription().equals(""));
    }

    public void testUserFromJsonMissing() throws Exception {
        User test = JsonConverter.userFromJson(jsonMissing1);
        assertTrue(test == null);

        test = JsonConverter.userFromJson(jsonMissing2);
        assertTrue(test == null);
    }

    public void testRatingFromJsonFull() throws Exception {
        Rating test = JsonConverter.ratingFromJson(jsonRatingFull);
        assertEquals(test.getScore(), 5);
        assertEquals(test.getComment(), "star");
    }

    public void testRatingFromJsonMissing() throws Exception {
        Rating test = JsonConverter.ratingFromJson(jsonRatingMissing);
        assertEquals(test.getScore(), 3);
        assertEquals(test.getComment(), "");
    }

    public void testRatingFromJsonEmpty() throws Exception {
        try {
            Rating test = JsonConverter.ratingFromJson(jsonRatingEmpty);
            fail("Should of erred");
        } catch (Exception e) {}
    }

    public void testMessageFromJsonFull() throws Exception {
        Message test = JsonConverter.messageFromJson(jsonMessageFull);
        assertEquals(test.getMessage(), "Hi");
        assertEquals(test.getSender(), 205);
    }

    public void testMessageFromJsonMissing() throws Exception {
        try {
            Message test = JsonConverter.messageFromJson(jsonMessageMissing);
            fail("Should of erred");
        } catch (Exception e) {}
    }
}