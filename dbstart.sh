#!/bin/bash
read -p "Type your mysql username" uname
read -p "Type the path to the holandly database" dbpath
read -p "type the destination db or leave blank" db
mysql -u $uname -p $db < $dbpath;
#db migration