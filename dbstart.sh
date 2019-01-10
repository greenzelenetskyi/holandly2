#!/bin/bash

echo "Type your mysql username"
read uname
echo "Type path to the holandly database"
read dbpath
echo "Type the destination db or leave blank"
read db
mysql -u "$uname" -p "$db" < "$dbpath"
