#!/bin/bash

if [ $EUID != 0 ]; then
    sudo "$0" "$@"
    exit $?
fi

echo "[STARTING SERVER TO INIT DATABASE]"
echo
rm study_database.sqlite
rm -rf test_output
mkdir test_output
node main.js &
echo "[PLEASE WAIT... PREPOPULATING DATABASE]"
echo
sleep 5 # allow the node app to create tables before killing process
pkill node # kill the node process; mocha restarts it and will fail if there's something bound to port 80
sqlite3 study_database.sqlite < dbscripts/testusers.sql
sqlite3 study_database.sqlite < dbscripts/testratings.sql
echo "[RUNNING UNIT TESTS NOW]"
echo
mocha test/api_endpoint_tests.js > test_output/api_endpoint_test.log
mocha test/User_unit_tests.js > test_output/user_unit_test.log
mocha test/UserMatch_unit_tests.js > test_output/usermatch_unit_test.log

echo "[RESETING ENV FOR INTEGRATION TESTS]"
echo
rm study_database.sqlite
node main.js &
echo "[PLEASE WAIT... PREPOPULATING DATABASE]"
echo
sleep 5 # allow the node app to create tables before killing process
pkill node # kill the node process; mocha restarts it and will fail if there's something bound to port 80
sqlite3 study_database.sqlite < dbscripts/testusers.sql
sqlite3 study_database.sqlite < dbscripts/testratings.sql
echo "[RUNNING INTEGRATION TESTS NOW]"
echo
mocha test/integration_tests.js > test_output/integration_test.log

echo "[Running DATABASE UNIT TESTS]"
echo
mocha test/DB_unit_tests.js > test_output/unit_tests.log

echo "[TEST RESULTS PLACED IN test_output DIRECTORY]"
echo


