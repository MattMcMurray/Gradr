package com.se2.gradr.gradr.helpers;

import com.se2.gradr.gradr.Message;
import com.se2.gradr.gradr.Rating;

import junit.framework.TestCase;

import org.json.JSONObject;

public class JsonConverterTest extends TestCase {
    JSONObject jsonRatingFull, jsonRatingMissing, jsonRatingEmpty;
    JSONObject jsonMessageFull, jsonMessageMissing;

    public void setUp() throws Exception {
        super.setUp();
        jsonRatingFull = new JSONObject();
        jsonRatingFull.put("rating", "5");
        jsonRatingFull.put("comment", "star");

        jsonRatingMissing = new JSONObject();
        jsonRatingMissing.put("rating", "3");

        jsonRatingEmpty = new JSONObject();

        jsonMessageFull = new JSONObject();
        jsonMessageFull.put("message", "Hi");
        jsonMessageFull.put("createdAt", "");
        jsonMessageFull.put("sender", "205");
        jsonMessageFull.put("receiver", "201");

        jsonMessageMissing = new JSONObject();
        jsonMessageMissing.put("message", "Bye");
        jsonMessageMissing.put("sender", "201");
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