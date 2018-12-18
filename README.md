How to start with the projects

Run npm install

Export database:

  CREATE DATABASE holandly CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

  mysql -u [username] -p holandly < holandly.sql;
  
Add .env file to the working directory

Install redis

Run ./startup.sh