package com.se2.gradr.gradr;

import android.graphics.Bitmap;
import android.widget.ImageView;

import com.se2.gradr.gradr.helpers.DownloadImageInBackground;

import java.sql.Date;

/**
 * Created by steve on 09/03/16.
 * This class can basically be treated like a user, but we also have the added image functionality
 */
public class UserAndImage {
    private User user;
    private Bitmap bmp;

    private boolean imageRequestInTransit = false;

    public UserAndImage(User user) {
        this.user = user;
        bmp = null;
    }

    public void setBmp(Bitmap bmp) {
        this.bmp = bmp;
    }

    public boolean hasImage() {
        return bmp == null;
    }

    /*
     * Function specifically for setting the image of an imageView. If there isn't an image for this
     * user, we'll make an asynchronous call for it. If we've already made the call, the function
     * will do nothing, unless the call has already returned, in which case it will set the new image
     * immediately.
     */
    public void setImage(ImageView iv) {
        if (bmp == null) {
            if (imageRequestInTransit) {
                return;
            }
            imageRequestInTransit = true;
            System.out.println("Making request for " + user.getUsername());
            String url = user.getPicture();
            new DownloadImageInBackground(url, this).execute(iv);
            //We don't ever unset the imageInTransit flag because even once we get the image back, we don't want to ever load a second image for this user
        }
        else {
            iv.setImageBitmap(bmp);
        }
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public int getId() {
        return user.getId();
    }

    public String getFirstName() {
        return user.getFirstName();
    }

    public void setFirstName(String firstName) {
        user.setFirstName(firstName);
    }

    public String getLastName() {
        return user.getLastName();
    }

    public void setLastName(String lastName) {
        user.setLastName(lastName);
    }

    public String getCity() {
        return user.getCity();
    }

    public void setCity(String city) {
        user.setCity(city);
    }

    public String getCountry() {
        return user.getCountry();
    }

    public void setCountry(String country) {
        user.setCountry(country);
    }

    public String getSchool() {
        return user.getSchool();
    }

    public void setSchool(String school) {
        user.setSchool(school);
    }

    public String getCourses() {
        return user.getCourses();
    }

    public void setCourses(String courses) {
         user.setCourses(courses);
    }

    public String getGeneralDescription() {
        return user.getGeneralDescription();
    }

    public void setGeneralDescription(String generalDescription) {
        user.setGeneralDescription(generalDescription);
    }

    public String getHelpDescription() {
        return user.getHelpDescription();
    }

    public void setHelpDescription(String helpDescription) {
        user.setHelpDescription(helpDescription);
    }

    public Date getBirthdate() {
        return user.getBirthdate();
    }

    public void setBirthdate(Date birthdate) {
        user.setBirthdate(birthdate);
    }

    public String getUsername() {
        return user.getUsername();
    }

}
