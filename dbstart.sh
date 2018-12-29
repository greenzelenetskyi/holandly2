#!/bin/bash
echo "Type your mysql username"
read uname
echo "Type the path to the holandly database"
read dbpath
echo "type the destination db or leave blank"
read db
mysql -u $uname -p $db < $dbpath;
#db migration