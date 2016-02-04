#!/bin/bash

if [ $EUID != 0 ]; then
    sudo "$0" "$@"
    exit $?
fi

echo "[STARTING SERVER TO INIT DATABASE]"
rm study_database.sqlite
node main.js &
echo "[PLEASE WAIT... PREPOPULATING DATABASE]"
sleep 5 # allow the node app to create tables before killing process
pkill node
sqlite3 study_database.sqlite < dbscripts/testusers.sql
echo "[RUNNING TESTS NOW]"
mocha


