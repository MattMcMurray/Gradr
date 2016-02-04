#!/bin/bash

if [ $EUID != 0 ]; then
    sudo "$0" "$@"
    exit $?
fi

node main.js --stub_all& # make sure that the file 'study_database.sqlite' exists 
pkill node # kill the node process; mocha restarts it and will fail if there's something bound to port 80
sqlite3 study_database.sqlite < testusers.sql # fill the database with test data
mocha

