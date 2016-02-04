#!/bin/bash

if [ $EUID != 0 ]; then
    sudo "$0" "$@"
    exit $?
fi

echo "[STARTING SERVER TO INIT DATABASE""]"
echo
rm study_database.sqlite
node main.js --stub_all &
echo "[PLEASE WAIT... PREPOPULATING DATABASE""]"
echo
sleep 5 # allow the node app to create tables before killing process
pkill node # kill the node process; mocha restarts it and will fail if there's something bound to port 80
sqlite3 study_database.sqlite < dbscripts/testusers.sql
echo "[RUNNING UNIT TESTS NOW""]"
echo
mocha test/api_endpoint_tests.js
mocha test/User_unit_tests.js

echo "[RESETING ENV FOR INTEGRATION TESTS]"
echo
rm study_database.sqlite
node main.js &
echo "[PLEASE WAIT... PREPOPULATING DATABASE""]"
echo
sleep 5 # allow the node app to create tables before killing process
pkill node # kill the node process; mocha restarts it and will fail if there's something bound to port 80
sqlite3 study_database.sqlite < dbscripts/testusers.sql
echo "[RUNNING INTEGRATION TESTS NOW""]"
echo
mocha test/integration_tests.js


