#!/bin/bash

read -p "Type your mysql username" uname
read -p "Type path to the holandly database" dbpath
read -p "Type the destination db or leave blank" db
mysql -u $uname -p $db < $dbpath

