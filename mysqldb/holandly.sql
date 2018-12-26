-- MySQL dump 10.13  Distrib 5.7.24, for Linux (x86_64)
--
-- Host: localhost    Database: holandly
-- ------------------------------------------------------
-- Server version	5.7.24-0ubuntu0.16.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `host`
--

DROP TABLE IF EXISTS `host`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `host` (
  `userid` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `configuration` json DEFAULT NULL,
  `privatedata` json DEFAULT NULL,
  `publicdata` json DEFAULT NULL,
  `title` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `api_token` mediumtext COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`userid`),
  UNIQUE KEY `username_UNIQUE` (`username`),
  UNIQUE KEY `userid_UNIQUE` (`userid`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `host`
--

LOCK TABLES `host` WRITE;
/*!40000 ALTER TABLE `host` DISABLE KEYS */;
INSERT INTO `host` VALUES (1,'shpp','hola4','{\"types\": {\"grownups\": {\"form\": {\"fields\": [{\"type\": \"text\", \"label\": \"Имя И фамилия\", \"regex\": \".+ .+\", \"minLen\": 5}, {\"type\": \"text\", \"label\": \"email\", \"regex\": \".*@.*\\\\..*\"}]}, \"path\": \"exam\", \"color\": \"#00ffff\", \"title\": \"[7-11 лет] Вступительный тест\", \"secret\": false, \"enabled\": true, \"location\": \"Ш++, г. Кропивницкий, пер. Васильевский, 5 этаж\", \"override\": {\"exactday\": {\"2018.11.11\": {\"slots\": []}, \"2018.11.12\": {\"reuse\": \"2018.11.11\"}}}, \"canCancel\": true, \"rangeDays\": 15, \"recurring\": {\"weekly\": {\"days\": [{\"slots\": [{\"time\": \"10:00\"}, {\"time\": \"11:00\"}, {\"time\": \"12:00\"}, {\"time\": \"13:00\"}, {\"time\": \"14:00\"}, {\"time\": \"15:00\"}, {\"time\": \"16:00\"}, {\"time\": \"17:00\"}]}, {\"reuse\": 0}, {\"reuse\": 0}, {\"reuse\": 0}, {\"reuse\": 0}, {\"slots\": [{\"time\": \"11:00\"}, {\"time\": \"12:00\"}, {\"time\": \"13:00\"}, {\"time\": \"14:00\"}, {\"time\": \"15:00\"}, {\"time\": \"16:00\"}]}]}}, \"description\": \"Обязательно указывайте электронный адрес, с которым вы регистрировались на портале. Будьте внимательны — записаться можно только один раз\", \"durationMinutes\": 120, \"cancellationPolicy\": \"...\", \"concurrentVisitors\": 2}}, \"timezone\": \"GMT+3\", \"toplevel\": {\"title\": \"Школа программирования Ш++\", \"endmessage\": \"Спасибо за регистрацию!\", \"description\": \"Добро пожаловать! Выберите, пожалуйста, удобную для вас дату и время\"}}','{\"webhookUrl\": \"http://....{{}}\", \"redirectOnConfirmation\": \"http://....\"}','{\"types\": {\"grownups\": {\"form\": {\"fields\": [{\"type\": \"text\", \"label\": \"Имя И фамилия\", \"regex\": \".+ .+\", \"minLen\": 5}, {\"type\": \"text\", \"label\": \"email\", \"regex\": \".*@.*\\\\..*\"}]}, \"path\": \"exam\", \"color\": \"#00ffff\", \"title\": \"[7-11 лет] Вступительный тест\", \"secret\": false, \"enabled\": true, \"location\": \"Ш++, г. Кропивницкий, пер. Васильевский, 5 этаж\", \"override\": {\"exactday\": {\"2018.11.11\": {\"slots\": []}, \"2018.11.12\": {\"reuse\": \"2018.11.11\"}}}, \"canCancel\": true, \"rangeDays\": 15, \"recurring\": {\"weekly\": {\"days\": [{\"slots\": [{\"time\": \"10:00\"}, {\"time\": \"11:00\"}, {\"time\": \"12:00\"}, {\"time\": \"13:00\"}, {\"time\": \"14:00\"}, {\"time\": \"15:00\"}, {\"time\": \"16:00\"}, {\"time\": \"17:00\"}]}, {\"reuse\": 0}, {\"reuse\": 0}, {\"reuse\": 0}, {\"reuse\": 0}, {\"slots\": [{\"time\": \"11:00\"}, {\"time\": \"12:00\"}, {\"time\": \"13:00\"}, {\"time\": \"14:00\"}, {\"time\": \"15:00\"}, {\"time\": \"16:00\"}]}]}}, \"description\": \"Обязательно указывайте электронный адрес, с которым вы регистрировались на портале. Будьте внимательны — записаться можно только один раз\", \"durationMinutes\": 120, \"cancellationPolicy\": \"...\", \"concurrentVisitors\": 2}}, \"timezone\": \"GMT+3\", \"toplevel\": {\"title\": \"Школа программирования Ш++\", \"endmessage\": \"Спасибо за регистрацию!\", \"description\": \"Добро пожаловать! Выберите, пожалуйста, удобную для вас дату и время\"}}','Школа программирования Ш++','eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoxLCJpYXQiOjE1NDU4NTY3NTV9.9tBO9Y1ZDVNng1y9JrblSXcEEkpuT1fuD6Y-KvveGy6NO--N_7xlzP6XxjqrblhN4x8wngqFpzbWhgeR17LvZA');
/*!40000 ALTER TABLE `host` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `scheduled_events`
--

DROP TABLE IF EXISTS `scheduled_events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `scheduled_events` (
  `eventid` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `time` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userid` int(11) NOT NULL,
  `cancelledbyhost` tinyint(4) DEFAULT '0',
  `cancelledbyvisitor` tinyint(4) DEFAULT '0',
  `showed_up` tinyint(4) DEFAULT '0',
  `event_data` json NOT NULL,
  `insertion_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`eventid`),
  UNIQUE KEY `eventid_UNIQUE` (`eventid`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `scheduled_events`
--

LOCK TABLES `scheduled_events` WRITE;
/*!40000 ALTER TABLE `scheduled_events` DISABLE KEYS */;
INSERT INTO `scheduled_events` VALUES (1,'some','07-12-2019','12:00','email@a.com','Вася',1,1,0,1,'{\"title\": \"[7-11 лет] Вступительный тест\", \"location\": \"Ш++, г. Кропивницкий, пер. Васильевский, 5 этаж\", \"description\": \"Обязательно указывайте электронный адрес, с которым вы регистрировались на портале. Будьте внимательны — записаться можно только один раз\"}','2018-12-21 12:44:48'),(2,'some other','09-10-2001','11:00','afdssad@a.com','Карась',1,1,0,0,'{\"title\": \"[7-11 лет] Вступительный тест\", \"location\": \"Ш++, г. Кропивницкий, пер. Васильевский, 5 этаж\", \"description\": \"Обязательно указывайте электронный адрес, с которым вы регистрировались на портале. Будьте внимательны — записаться можно только один раз\"}','2018-12-21 12:49:32'),(3,'teenagers','12-12-2019','11:00','em@aa.com','Петя',1,1,0,1,'{\"title\": \"[7-11 лет] Вступительный тест\", \"location\": \"Ш++, г. Кропивницкий, пер. Васильевский, 5 этаж\", \"description\": \"Обязательно указывайте электронный адрес, с которым вы регистрировались на портале. Будьте внимательны — записаться можно только один раз\"}','2018-12-22 16:26:01'),(4,'teenagers','12-12-2019','10:00','em@aa.com','Петя',1,1,0,1,'{\"title\": \"[7-11 лет] Вступительный тест\", \"location\": \"Ш++, г. Кропивницкий, пер. Васильевский, 5 этаж\", \"description\": \"Обязательно указывайте электронный адрес, с которым вы регистрировались на портале. Будьте внимательны — записаться можно только один раз\"}','2018-12-22 16:32:37'),(5,'teenagers','12-12-2019','10:00','em@aa.com','Петя',1,1,0,1,'{\"title\": \"[7-11 лет] Вступительный тест\", \"location\": \"Ш++, г. Кропивницкий, пер. Васильевский, 5 этаж\", \"description\": \"Обязательно указывайте электронный адрес, с которым вы регистрировались на портале. Будьте внимательны — записаться можно только один раз\"}','2018-12-22 16:34:24'),(6,'teenagers','12-12-2019','9:00','em@aa.com','Петя',1,1,0,1,'{\"title\": \"[7-11 лет] Вступительный тест\", \"location\": \"Ш++, г. Кропивницкий, пер. Васильевский, 5 этаж\", \"description\": \"Обязательно указывайте электронный адрес, с которым вы регистрировались на портале. Будьте внимательны — записаться можно только один раз\"}','2018-12-22 16:34:36'),(7,'teenagers','12-12-2019','9:00','em@aa.com','Петя',1,1,0,0,'{\"title\": \"[7-11 лет] Вступительный тест\", \"location\": \"Ш++, г. Кропивницкий, пер. Васильевский, 5 этаж\", \"description\": \"Обязательно указывайте электронный адрес, с которым вы регистрировались на портале. Будьте внимательны — записаться можно только один раз\"}','2018-12-22 16:39:21'),(8,'teenagers','12-12-2019','8:00','em@aa.com','Петя',1,1,0,0,'{\"title\": \"[7-11 лет] Вступительный тест\", \"location\": \"Ш++, г. Кропивницкий, пер. Васильевский, 5 этаж\", \"description\": \"Обязательно указывайте электронный адрес, с которым вы регистрировались на портале. Будьте внимательны — записаться можно только один раз\"}','2018-12-22 16:39:33'),(9,'teenagers','12-12-2019','5:00','em@aa.com','Петя',1,1,0,1,'{\"title\": \"[7-11 лет] Вступительный тест\", \"location\": \"Ш++, г. Кропивницкий, пер. Васильевский, 5 этаж\", \"description\": \"Обязательно указывайте электронный адрес, с которым вы регистрировались на портале. Будьте внимательны — записаться можно только один раз\"}','2018-12-22 16:40:57'),(10,'teenagers','12-12-2019','5:00','em@aa.com','Петя',1,1,0,0,'{\"title\": \"[7-11 лет] Вступительный тест\", \"location\": \"Ш++, г. Кропивницкий, пер. Васильевский, 5 этаж\", \"description\": \"Обязательно указывайте электронный адрес, с которым вы регистрировались на портале. Будьте внимательны — записаться можно только один раз\"}','2018-12-22 16:43:37'),(11,'teenagers','12-12-2019','4:00','em@aa.com','Петя',1,1,0,1,'{\"title\": \"[7-11 лет] Вступительный тест\", \"location\": \"Ш++, г. Кропивницкий, пер. Васильевский, 5 этаж\", \"description\": \"Обязательно указывайте электронный адрес, с которым вы регистрировались на портале. Будьте внимательны — записаться можно только один раз\"}','2018-12-22 16:43:45'),(12,'teenagers','12-12-2019','4:00','m@aa.com','Петя',1,1,0,1,'{\"title\": \"[7-11 лет] Вступительный тест\", \"location\": \"Ш++, г. Кропивницкий, пер. Васильевский, 5 этаж\", \"description\": \"Обязательно указывайте электронный адрес, с которым вы регистрировались на портале. Будьте внимательны — записаться можно только один раз\"}','2018-12-22 16:52:51'),(13,'teenagers','12-12-2019','4:00','m@aa.com','Чача',1,1,0,0,'{\"title\": \"[7-11 лет] Вступительный тест\", \"location\": \"Ш++, г. Кропивницкий, пер. Васильевский, 5 этаж\", \"description\": \"Обязательно указывайте электронный адрес, с которым вы регистрировались на портале. Будьте внимательны — записаться можно только один раз\"}','2018-12-24 15:09:41'),(14,'teenagers','12-12-2019','4:00','a@aa.com','Чача',1,1,0,0,'{\"title\": \"[7-11 лет] Вступительный тест\", \"location\": \"Ш++, г. Кропивницкий, пер. Васильевский, 5 этаж\", \"description\": \"Обязательно указывайте электронный адрес, с которым вы регистрировались на портале. Будьте внимательны — записаться можно только один раз\"}','2018-12-24 15:10:00'),(15,'teenagers','12-12-2019','4:00','k@aa.com','Чача',1,1,0,1,'{\"title\": \"[7-11 лет] Вступительный тест\", \"location\": \"Ш++, г. Кропивницкий, пер. Васильевский, 5 этаж\", \"description\": \"Обязательно указывайте электронный адрес, с которым вы регистрировались на портале. Будьте внимательны — записаться можно только один раз\"}','2018-12-24 16:39:38'),(16,'teenagers','12-12-2019','4:00','aaaaaaa@aa.com','Лях',1,1,0,1,'{\"title\": \"[7-11 лет] Вступительный тест\", \"location\": \"Ш++, г. Кропивницкий, пер. Васильевский, 5 этаж\", \"description\": \"Обязательно указывайте электронный адрес, с которым вы регистрировались на портале. Будьте внимательны — записаться можно только один раз\"}','2018-12-24 16:45:12'),(17,'teenagers','12-12-2019','4:00','bbbbb@aa.com','Jх',1,1,0,1,'{\"title\": \"[7-11 лет] Вступительный тест\", \"location\": \"Ш++, г. Кропивницкий, пер. Васильевский, 5 этаж\", \"description\": \"Обязательно указывайте электронный адрес, с которым вы регистрировались на портале. Будьте внимательны — записаться можно только один раз\"}','2018-12-24 16:54:01'),(18,'teenagers','12-12-2019','4:00','vlcm@aa.com','Тетя',1,1,0,1,'{\"title\": \"[7-11 лет] Вступительный тест\", \"location\": \"Ш++, г. Кропивницкий, пер. Васильевский, 5 этаж\", \"description\": \"Обязательно указывайте электронный адрес, с которым вы регистрировались на портале. Будьте внимательны — записаться можно только один раз\"}','2018-12-24 17:21:28'),(19,'teenagers','12-12-2019','4:00','ttt@aa.com','Балда',1,1,0,1,'{\"title\": \"[7-11 лет] Вступительный тест\", \"location\": \"Ш++, г. Кропивницкий, пер. Васильевский, 5 этаж\", \"description\": \"Обязательно указывайте электронный адрес, с которым вы регистрировались на портале. Будьте внимательны — записаться можно только один раз\"}','2018-12-24 17:25:38'),(20,'teenagers','12-12-2019','4:00','ala@aa.com','Кучка',1,1,0,1,'{\"title\": \"[7-11 лет] Вступительный тест\", \"location\": \"Ш++, г. Кропивницкий, пер. Васильевский, 5 этаж\", \"description\": \"Обязательно указывайте электронный адрес, с которым вы регистрировались на портале. Будьте внимательны — записаться можно только один раз\"}','2018-12-24 17:27:33'),(21,'teenagers','12-12-2019','4:00','alazqt@aa.com','Lasd',1,1,0,0,'{\"title\": \"[7-11 лет] Вступительный тест\", \"location\": \"Ш++, г. Кропивницкий, пер. Васильевский, 5 этаж\", \"description\": \"Обязательно указывайте электронный адрес, с которым вы регистрировались на портале. Будьте внимательны — записаться можно только один раз\"}','2018-12-24 17:30:05'),(22,'teenagers','12-12-2019','4:00','afadszqt@aa.com','Lasd',1,1,0,0,'{\"title\": \"[7-11 лет] Вступительный тест\", \"location\": \"Ш++, г. Кропивницкий, пер. Васильевский, 5 этаж\", \"description\": \"Обязательно указывайте электронный адрес, с которым вы регистрировались на портале. Будьте внимательны — записаться можно только один раз\"}','2018-12-24 18:32:35'),(23,'teenagers','12-12-2019','4:00','r@aa.com','Ron',1,1,0,0,'{\"title\": \"[7-11 лет] Вступительный тест\", \"location\": \"Ш++, г. Кропивницкий, пер. Васильевский, 5 этаж\", \"description\": \"Обязательно указывайте электронный адрес, с которым вы регистрировались на портале. Будьте внимательны — записаться можно только один раз\"}','2018-12-24 18:38:38'),(24,'teenagers','12-12-2019','4:00','rr@aa.com','Ron',1,1,0,0,'{\"title\": \"[7-11 лет] Вступительный тест\", \"location\": \"Ш++, г. Кропивницкий, пер. Васильевский, 5 этаж\", \"description\": \"Обязательно указывайте электронный адрес, с которым вы регистрировались на портале. Будьте внимательны — записаться можно только один раз\"}','2018-12-24 18:38:46'),(25,'teenagers','12-12-2019','4:00','kaka@aa.com','Ron',1,1,0,0,'{\"title\": \"[7-11 лет] Вступительный тест\", \"location\": \"Ш++, г. Кропивницкий, пер. Васильевский, 5 этаж\", \"description\": \"Обязательно указывайте электронный адрес, с которым вы регистрировались на портале. Будьте внимательны — записаться можно только один раз\"}','2018-12-24 19:03:57'),(26,'teenagers','12-12-2019','4:00','yua@aa.com','Ron',1,1,0,0,'{\"title\": \"[7-11 лет] Вступительный тест\", \"location\": \"Ш++, г. Кропивницкий, пер. Васильевский, 5 этаж\", \"description\": \"Обязательно указывайте электронный адрес, с которым вы регистрировались на портале. Будьте внимательны — записаться можно только один раз\"}','2018-12-24 19:07:36'),(27,'teenagers','12-12-2019','4:00','yyya@aa.com','Ron',1,1,0,0,'{\"title\": \"[7-11 лет] Вступительный тест\", \"location\": \"Ш++, г. Кропивницкий, пер. Васильевский, 5 этаж\", \"description\": \"Обязательно указывайте электронный адрес, с которым вы регистрировались на портале. Будьте внимательны — записаться можно только один раз\"}','2018-12-24 19:09:00'),(28,'teenagers','12-12-2019','4:00','yttta@aa.com','Ron',1,1,0,0,'{\"title\": \"[7-11 лет] Вступительный тест\", \"location\": \"Ш++, г. Кропивницкий, пер. Васильевский, 5 этаж\", \"description\": \"Обязательно указывайте электронный адрес, с которым вы регистрировались на портале. Будьте внимательны — записаться можно только один раз\"}','2018-12-24 19:12:43'),(29,'teenagers','12-12-2019','4:00','qqqq@aa.com','Ron',1,1,0,0,'{\"title\": \"[7-11 лет] Вступительный тест\", \"location\": \"Ш++, г. Кропивницкий, пер. Васильевский, 5 этаж\", \"description\": \"Обязательно указывайте электронный адрес, с которым вы регистрировались на портале. Будьте внимательны — записаться можно только один раз\"}','2018-12-24 19:14:22'),(30,'teenagers','12-12-2019','4:00','q@aa.com','Ron',1,1,0,0,'{\"title\": \"[7-11 лет] Вступительный тест\", \"location\": \"Ш++, г. Кропивницкий, пер. Васильевский, 5 этаж\", \"description\": \"Обязательно указывайте электронный адрес, с которым вы регистрировались на портале. Будьте внимательны — записаться можно только один раз\"}','2018-12-24 19:15:22'),(31,'teenagers','12-12-2019','4:00','qaaa@aa.com','Ron',1,1,0,0,'{\"title\": \"[7-11 лет] Вступительный тест\", \"location\": \"Ш++, г. Кропивницкий, пер. Васильевский, 5 этаж\", \"description\": \"Обязательно указывайте электронный адрес, с которым вы регистрировались на портале. Будьте внимательны — записаться можно только один раз\"}','2018-12-24 19:16:41'),(32,'teenagers','12-12-2019','4:00','uuuu@aa.com','Rot',1,1,0,0,'{\"title\": \"[7-11 лет] Вступительный тест\", \"location\": \"Ш++, г. Кропивницкий, пер. Васильевский, 5 этаж\", \"description\": \"Обязательно указывайте электронный адрес, с которым вы регистрировались на портале. Будьте внимательны — записаться можно только один раз\"}','2018-12-24 19:19:38'),(33,'teenagers','12-12-2019','4:00','rrrr@aa.com','Rot',1,1,0,0,'{\"title\": \"[7-11 лет] Вступительный тест\", \"location\": \"Ш++, г. Кропивницкий, пер. Васильевский, 5 этаж\", \"description\": \"Обязательно указывайте электронный адрес, с которым вы регистрировались на портале. Будьте внимательны — записаться можно только один раз\"}','2018-12-24 19:22:21'),(34,'teenagers','12-12-2019','4:00','l@aa.com','Rot',1,1,0,0,'{\"title\": \"[7-11 лет] Вступительный тест\", \"location\": \"Ш++, г. Кропивницкий, пер. Васильевский, 5 этаж\", \"description\": \"Обязательно указывайте электронный адрес, с которым вы регистрировались на портале. Будьте внимательны — записаться можно только один раз\"}','2018-12-26 20:49:23');
/*!40000 ALTER TABLE `scheduled_events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) unsigned NOT NULL,
  `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES ('0UXXZTznJeK4zZrqMVC_zrAM96hKxZAF',1545924956,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"}}'),('739jrczgtasehATUOUAJMN5bkCZzMVk1',1545925003,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"}}'),('7_g9nUMhUEiZ7DuZ0pAWigJ9WU_AlHnq',1545924908,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"}}'),('8vd4XIDHaTNwQE7RefPL4ZjYPfirUZoM',1545925003,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"}}'),('EuPKZ1QQjwaFPsczeczHS35wiUq99vf1',1545924956,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"}}'),('TQveHJaOIkpLlM2tjP3Q2VKg099DaP6w',1545924738,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"}}'),('WPEd-NiVqfxodGk-zAHqSbz2WBHbEQwZ',1545945664,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"}}'),('b9gfoc8KjZZzKT--eFNz4ftcS0sQhEOQ',1545924738,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"}}'),('gySjjcS40t_XpjMEqJJ3BKuNnTxr7Spb',1545945672,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":{\"userId\":1,\"title\":\"Школа программирования Ш++\",\"username\":\"shpp\"}}}'),('h3in_84SX6dmRk2KQ4yykkKaz1ateHP2',1545924908,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"}}'),('w8ipdvxZxUhZahQ8iEldMzcdYLEZ_qR_',1545943647,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"}}'),('x0tr-uG9w7lJTc5GuwmZWnEpWyccw4Nu',1545856809,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"passport\":{\"user\":{\"userId\":1,\"title\":\"Школа программирования Ш++\",\"username\":\"shpp\"}}}');
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-12-26 23:22:07
