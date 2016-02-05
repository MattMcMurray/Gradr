#!/bin/bash

if [ $EUID != 0 ]; then
    sudo "$0" "$@"
    exit $?
fi

apt-get -y update

#################################
## Install Node.js version 4.X ##
#################################
apt-get install -y curl
curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
sudo apt-get install -y nodejs
apt-get install -y build-essential
apt-get install -y sqlite3 libsqlite3-dev

npm install
