package com.se2.gradr.gradr;

import junit.framework.TestCase;

import java.sql.Date;

public class MessageTest extends TestCase {
    private Message msg;
    private String comment, sender, receiver, time;

    public void setUp() throws Exception {
        comment = "hi";
        sender = "201";
        receiver = "206";
        time = "2016-17-03T14:50:12";
        msg = new Message(comment, sender, receiver, time);
    }

    public void testMessage() throws Exception {
        assertEquals(msg.getSender(), 201);
        assertEquals(msg.getMessage(), comment);
    }

    public void testCompareTo() throws Exception {
        //i.e. 03/15/2016 @ 12:00pm (UTC)
        Date test = new Date(1458043200);
        int result = msg.compareTo(test);
        assertEquals(result, 1);
    }

    public void testMessageCreation() throws Exception {
        try {
            Message errMsg = new Message("hi", "205", "230", "2016-17-03T50:12");
            fail("Should have erred");
        } catch (Exception e) {}
        try {
            Message errMsg = new Message("hi", "205a", "2d30", "2016-17-03T14:50:12");
            fail("Should have erred");
        } catch (Exception e) {}
    }
}