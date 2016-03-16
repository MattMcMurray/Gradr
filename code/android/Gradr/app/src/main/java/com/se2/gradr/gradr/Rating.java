package com.se2.gradr.gradr;

/**
 * Created by steve on 15/03/16.
 */
public class Rating {
    private String comment;
    private int score;

    public Rating(String comment, int score) {
        this.comment = comment;
        this.score = score;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }
}
