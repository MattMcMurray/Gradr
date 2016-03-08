package com.se2.gradr.gradr;

import android.provider.SyncStateContract;

import java.sql.Date;

/**
 * Created by steve on 03/03/16.
 */
public class User {
    private String username;
    private int id;

    private String firstName;
    private String lastName;
    private String city;
    private String country;
    private String school;
    private String courses;
    private String generalDescription;
    private String helpDescription;
    private Date birthdate;

    public User(String username, int id, String firstName, String lastName,
                String city, String country, String school,
                String courses, String generalDescription, String helpDescription) {
        this.username = username;
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.city = city;
        this.country = country;
        this.school = school;
        this.courses = courses;
        this.generalDescription = generalDescription;
        this.helpDescription = helpDescription;
    }

    public User() {
        username = "test";
        id = 0;
        firstName = "test";
        lastName = "test";
        city = "test";
        country = "test";
        school = "test";
        courses = "test";
        generalDescription = "test";
        helpDescription = "test";
    }

    public String toString() {
        return username + id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getSchool() {
        return school;
    }

    public void setSchool(String school) {
        this.school = school;
    }

    public String getCourses() {
        return courses;
    }

    public void setCourses(String courses) {
        this.courses = courses;
    }

    public String getGeneralDescription() {
        return generalDescription;
    }

    public void setGeneralDescription(String generalDescription) {
        this.generalDescription = generalDescription;
    }

    public String getHelpDescription() {
        return helpDescription;
    }

    public void setHelpDescription(String helpDescription) {
        this.helpDescription = helpDescription;
    }

    public Date getBirthdate() {
        return birthdate;
    }

    public void setBirthdate(Date birthdate) {
        this.birthdate = birthdate;
    }

    public String getUsername() {
        return username;
    }

    public int getId() {
        return id;
    }
}
