package com.se2.gradr.gradr;

import android.graphics.Bitmap;
import android.provider.SyncStateContract;
import android.widget.ImageView;

import com.se2.gradr.gradr.helpers.DownloadImageInBackground;

import java.io.Serializable;
import java.sql.Date;

/**
 * Created by steve on 03/03/16.
 */
public class User implements Serializable {
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

    private Bitmap bmp = null;
    private boolean imageRequestInTransit = false;

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
        System.out.println(firstName);
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        System.out.println(lastName);
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
        System.out.println(username);
        return username;
    }

    public int getId() {
        return id;
    }

    public Bitmap getBmp() {
        return bmp;
    }

    public void setBmp(Bitmap bmp) {
        this.bmp = bmp;
    }

    public boolean hasImage() {
        if (bmp == null) {
            return false;
        }
        return true;
    }

    public void setImage(ImageView iv) {
        if (bmp == null) {
            if (imageRequestInTransit) {
                return;
            }
            imageRequestInTransit = true;
            String url = "http://thecatapi.com/api/images/get?format=src&type=jpg&size=small" + Math.random();
            new DownloadImageInBackground(url, this).execute(iv);
            //We don't ever unset the imageInTransit flag because even once we get the image back, we don't want to ever load a second image for this user
        }
        else {
            iv.setImageBitmap(bmp);
        }
    }
}
