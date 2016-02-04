#!/bin/bash

if [ $EUID != 0 ]; then
    sudo "$0" "$@"
    exit $?
fi

rm study_database.sqlite
node main.js &
sleep 2 # allow the node app to create tables before killing process
pkill node
sqlite3 study_database.sqlite < dbscripts/testusers.sql
mocha


