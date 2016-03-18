package com.se2.gradr.gradr;

import junit.framework.TestCase;

import java.sql.Date;

public class UserTest extends TestCase {
    private User testUser;
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


    protected void setUp() {
        testUser = new User(username, id, firstName, lastName, city, country,
                school, courses, generalDescription, helpDescription, birthdate);
    }

    public void testGetters() throws Exception {
        assertTrue(testUser.toString().equals(username+id));
        assertTrue(testUser.getFirstName().equals(firstName));
        assertTrue(testUser.getUsername().equals(username));
        assertTrue(testUser.getId() == id);
        assertTrue(testUser.getLastName().equals(lastName));
        assertTrue(testUser.getCity().equals(city));
        assertTrue(testUser.getCountry().equals(country));
        assertTrue(testUser.getSchool().equals(school));
        assertTrue(testUser.getCourses().equals(courses));
        assertTrue(testUser.getGeneralDescription().equals(generalDescription));
        assertTrue(testUser.getHelpDescription().equals(helpDescription));
        assertTrue(testUser.getBirthdate().equals(birthdate));
    }

    public void testSetters() throws Exception {
        testUser.setFirstName(firstName2);
        testUser.setLastName(lastName2);
        testUser.setBirthdate(birthdate2);
        testUser.setCity(city2);
        testUser.setCountry(country2);
        testUser.setCourses(courses2);
        testUser.setGeneralDescription(generalDescription2);
        testUser.setHelpDescription(helpDescription2);
        testUser.setSchool(school2);

        assertTrue(testUser.getFirstName().equals(firstName2));
        assertTrue(testUser.getLastName().equals(lastName2));
        assertTrue(testUser.getCity().equals(city2));
        assertTrue(testUser.getCountry().equals(country2));
        assertTrue(testUser.getSchool().equals(school2));
        assertTrue(testUser.getCourses().equals(courses2));
        assertTrue(testUser.getGeneralDescription().equals(generalDescription2));
        assertTrue(testUser.getHelpDescription().equals(helpDescription2));
        assertTrue(testUser.getBirthdate().equals(birthdate2));
    }



}