package com.se2.gradr.gradr.helpers;

import com.se2.gradr.gradr.User;

import org.json.JSONObject;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.*;

public class JsonConverterTest {
    JSONObject jsonFull, jsonEmpty, jsonMissing1, jsonMissing2;
    @Before
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
    }

    @Test
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

    @Test
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

    @Test
    public void testUserFromJsonMissing() throws Exception {
        User test = JsonConverter.userFromJson(jsonMissing1);
        assertTrue(test == null);

        test = JsonConverter.userFromJson(jsonMissing2);
        assertTrue(test == null);
    }
}

