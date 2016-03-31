package com.se2.gradr.gradr;

/**
 * Created by steve on 28/03/16.
 */
public class LeaderBoardEntry {
    private User user;
    private int likes;

    public LeaderBoardEntry(User user, int likes) {
        this.user = user;
        this.likes = likes;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public int getLikes() {
        return likes;
    }

    public void setLikes(int likes) {
        this.likes = likes;
    }
}
