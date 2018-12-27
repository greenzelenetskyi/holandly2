#!/bin/bash
echo "Type your mysql username"
read uname
echo "CREATE DATABASE holandly CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" | mysql -u $uname -p;
echo "Type the path to the holandly database"
read dbpath
mysql -u $uname -p holandly < $dbpath;