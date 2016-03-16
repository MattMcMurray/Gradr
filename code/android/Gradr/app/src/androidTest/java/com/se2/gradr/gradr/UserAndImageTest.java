package com.se2.gradr.gradr;

import android.graphics.Bitmap;
import android.widget.ImageView;

import junit.framework.TestCase;

import java.sql.Date;

public class UserAndImageTest extends TestCase {
    private User testUser;
    private UserAndImage testUAI;
    private String username = "KeaneK";
    private String firstName = "Keane";
    private String lastName  = "Kraus";
    private int id = 402;
    private String city = "Winnipeg";
    private String country = "Canada";
    private String school = "UofM";
    private String courses = "COMP4350";
    private String generalDescription = "Gamer";
    private String helpDescription = "Help";
    private Date birthdate = new Date(726015600);

    private String firstName2 = "Kyle";
    private String lastName2  = "Krause";
    private String city2 = "Morden";
    private String country2 = "CaNaDa";
    private String school2 = "UofW";
    private String courses2 = "COMP4380";
    private String generalDescription2 = "Pro Gamer";
    private String helpDescription2 = "Helpppp";
    private Date birthdate2 = new Date(726010000);
    private Bitmap bmp = Bitmap.createBitmap(100, 100, Bitmap.Config.ARGB_8888);

    public void setUp() {
        testUser = new User(username, id, firstName, lastName, city, country,
                school, courses, generalDescription, helpDescription, birthdate);
        testUAI = new UserAndImage(testUser);
    }

    public void testGetters() throws Exception {
        assertTrue(testUAI.getFirstName().equals(firstName));
        assertTrue(testUAI.getUsername().equals(username));
        assertTrue(testUAI.getId() == id);
        assertTrue(testUAI.getLastName().equals(lastName));
        assertTrue(testUAI.getCity().equals(city));
        assertTrue(testUAI.getCountry().equals(country));
        assertTrue(testUAI.getSchool().equals(school));
        assertTrue(testUAI.getCourses().equals(courses));
        assertTrue(testUAI.getGeneralDescription().equals(generalDescription));
        assertTrue(testUAI.getHelpDescription().equals(helpDescription));
        assertTrue(testUAI.getBirthdate().equals(birthdate));
        assertTrue(testUAI.hasImage());

    }

    public void testSetters() throws Exception {
        testUAI.setFirstName(firstName2);
        testUAI.setLastName(lastName2);
        testUAI.setBirthdate(birthdate2);
        testUAI.setCity(city2);
        testUAI.setCountry(country2);
        testUAI.setCourses(courses2);
        testUAI.setGeneralDescription(generalDescription2);
        testUAI.setHelpDescription(helpDescription2);
        testUAI.setSchool(school2);
        testUAI.setBmp(bmp);

        assertTrue(testUAI.getFirstName().equals(firstName2));
        assertTrue(testUAI.getLastName().equals(lastName2));
        assertTrue(testUAI.getCity().equals(city2));
        assertTrue(testUAI.getCountry().equals(country2));
        assertTrue(testUAI.getSchool().equals(school2));
        assertTrue(testUAI.getCourses().equals(courses2));
        assertTrue(testUAI.getGeneralDescription().equals(generalDescription2));
        assertTrue(testUAI.getHelpDescription().equals(helpDescription2));
        assertTrue(testUAI.getBirthdate().equals(birthdate2));
        assertFalse(testUAI.hasImage());
    }
}
