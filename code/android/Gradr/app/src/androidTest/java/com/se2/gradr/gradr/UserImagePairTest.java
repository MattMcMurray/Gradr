package com.se2.gradr.gradr;

import android.graphics.Bitmap;

import junit.framework.TestCase;

import java.util.Date;

public class UserImagePairTest extends TestCase {
    private String username = "MattMcMurray";
    private String firstName = "Matt";
    private String lastName = "McMurray";
    private String city = "Moscow";
    private String country = "Russia";
    private String school = "Putin's Academy of Destruction";
    private String courses = "Invasion 101, Torture Techniques for the 21st century";
    private String generalDescription = "I am best";
    private String helpDescription = "in da land";

    private int id = 999;

    private User testUser;
    private User testUser2;
    private Bitmap bmp;
    private Bitmap bmp2;
    private User nullUser = null;
    private Bitmap nullBmp = null;
    private UserImagePair pair;

    protected void setUp() {
        int w, h, w2, h2;
        w = h = 500;
        w2 = h2 = 350;
        Bitmap.Config conf = Bitmap.Config.ARGB_8888;

        testUser = new User(username, id, firstName, lastName, city,
                 country, school, courses, generalDescription, helpDescription);
        bmp = Bitmap.createBitmap(w, h, conf);

        testUser2 = new User(null, 0, null, null, null, null, null, null, null, null);
        bmp2 = Bitmap.createBitmap(w2, h2, conf);

        pair = new UserImagePair(testUser, bmp);
    }

    public void testGetters() throws Exception {
        assertTrue(pair.getUser() == testUser);
        assertTrue(pair.getBmp() == bmp);

        // Not totally necessary for this class, but extra testing can't hurt
        assertTrue(pair.getUser().getUsername().equals(username));
        assertTrue(pair.getUser().getFirstName().equals(firstName));
        assertTrue(pair.getUser().getLastName().equals(lastName));
        assertTrue(pair.getUser().getId() == id);
        assertTrue(pair.getUser().getCity().equals(city));
        assertTrue(pair.getUser().getCountry().equals(country));
        assertTrue(pair.getUser().getSchool().equals(school));
        assertTrue(pair.getUser().getCourses().equals(courses));
        assertTrue(pair.getUser().getGeneralDescription().equals(generalDescription));
        assertTrue(pair.getUser().getHelpDescription().equals(helpDescription));
    }

    public void testSetters() throws Exception {
        pair.setBmp(bmp2);
        pair.setUser(testUser2);

        assertTrue(pair.getUser() == testUser2);
        assertTrue(pair.getBmp() == bmp2);

        // Try setting null user and bitmap; should still work
        pair.setBmp(nullBmp);
        pair.setUser(nullUser);

        assertTrue(pair.getBmp() == null);
        assertTrue(pair.getUser() == null);
    }
}

