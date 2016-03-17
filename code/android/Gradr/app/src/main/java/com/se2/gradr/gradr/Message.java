package com.se2.gradr.gradr;

import java.sql.Date;
import java.text.DateFormat;
import java.text.SimpleDateFormat;

public class Message {
    private int sender;
    private int receiver;
    private Date timestamp;
    private String message;

    public Message(String message, String sender, String receiver, String time) {
        this.message = message;
        time = time.replace('T', ' ');
        DateFormat formatter = new SimpleDateFormat("yyyy-dd-MM HH:mm:ss");
        try {
            java.util.Date temp = (java.util.Date) formatter.parse(time);
            this.timestamp = new Date(temp.getTime());
        } catch (Exception e) {
            System.out.println("ERROR - Parsing time");
            System.out.println(e.toString());
        }
        this.sender = Integer.parseInt(sender);
        this.receiver = Integer.parseInt(receiver);
    }

    public String getMessage() {
        return message;
    }

    public int getSender() {
        return sender;
    }

    public int compareTo(Object o) {
        if (o instanceof Date) {
            return timestamp.compareTo((Date) o);
        }
        else {
            return 0;
        }
    }
}
