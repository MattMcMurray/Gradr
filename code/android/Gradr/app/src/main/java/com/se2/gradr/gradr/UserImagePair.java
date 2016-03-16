package com.se2.gradr.gradr;

import android.graphics.Bitmap;

/**
 * Created by steve on 08/03/16.
 */
public class UserImagePair {
    private User user;
    private Bitmap bmp;

    public UserImagePair(User user) {
        this.user = user;
        this.bmp = null;
    }

    public UserImagePair(User user, Bitmap bmp) {
        this.user = user;
        this.bmp = bmp;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Bitmap getBmp() {
        return bmp;
    }

    public void setBmp(Bitmap bmp) {
        this.bmp = bmp;
    }
}
