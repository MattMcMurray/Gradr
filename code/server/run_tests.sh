#!/bin/bash

if [ $EUID != 0 ]; then
    sudo "$0" "$@"
    exit $?
fi

touch study_database.sqlite
sqlite3 study_database.sqlite < dbscripts/testusers.sql
mocha


