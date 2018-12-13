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
  PRIMARY KEY (`userid`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `host`
--

LOCK TABLES `host` WRITE;
/*!40000 ALTER TABLE `host` DISABLE KEYS */;
INSERT INTO `host` VALUES (1,'shpp','hola4','{\"users\": {\"shpp\": {\"types\": {\"grownups\": {\"form\": {\"fields\": [{\"type\": \"text\", \"label\": \"Имя И фамилия\", \"regex\": \".+ .+\", \"minLen\": 5}, {\"type\": \"text\", \"label\": \"email\", \"regex\": \".*@.*\\\\..*\"}]}, \"path\": \"exam\", \"color\": \"#00ffff\", \"title\": \"[7-11 лет] Вступительный тест\", \"secret\": false, \"enabled\": true, \"location\": \"Ш++, г. Кропивницкий, пер. Васильевский, 5 этаж\", \"override\": {\"exactday\": {\"2018.11.11\": {\"slots\": []}, \"2018.11.12\": {\"reuse\": \"2018.11.11\"}}}, \"canCancel\": true, \"rangeDays\": 15, \"recurring\": {\"weekly\": {\"days\": [{\"slots\": [{\"time\": \"10:00\"}, {\"time\": \"11:00\"}, {\"time\": \"12:00\"}, {\"time\": \"13:00\"}, {\"time\": \"14:00\"}, {\"time\": \"15:00\"}, {\"time\": \"16:00\"}, {\"time\": \"17:00\"}]}, {\"reuse\": 0}, {\"reuse\": 0}, {\"reuse\": 0}, {\"reuse\": 0}, {\"slots\": [{\"time\": \"11:00\"}, {\"time\": \"12:00\"}, {\"time\": \"13:00\"}, {\"time\": \"14:00\"}, {\"time\": \"15:00\"}, {\"time\": \"16:00\"}]}]}}, \"description\": \"Обязательно указывайте электронный адрес, с которым вы регистрировались на портале. Будьте внимательны — записаться можно только один раз\", \"durationMinutes\": 120, \"cancellationPolicy\": \"...\", \"concurrentVisitors\": 2}}, \"timezone\": \"GMT+3\", \"toplevel\": {\"title\": \"Школа программирования Ш++\", \"endmessage\": \"Спасибо за регистрацию!\", \"description\": \"Добро пожаловать! Выберите, пожалуйста, удобную для вас дату и время\"}}}}','{\"webhookUrl\": \"http://....{{}}\", \"redirectOnConfirmation\": \"http://....\"}','{\"users\": {\"shpp\": {\"types\": {\"grownups\": {\"form\": {\"fields\": [{\"type\": \"text\", \"label\": \"Имя И фамилия\", \"regex\": \".+ .+\", \"minLen\": 5}, {\"type\": \"text\", \"label\": \"email\", \"regex\": \".*@.*\\\\..*\"}]}, \"path\": \"exam\", \"color\": \"#00ffff\", \"title\": \"[7-11 лет] Вступительный тест\", \"secret\": false, \"enabled\": true, \"location\": \"Ш++, г. Кропивницкий, пер. Васильевский, 5 этаж\", \"override\": {\"exactday\": {\"2018.11.11\": {\"slots\": []}, \"2018.11.12\": {\"reuse\": \"2018.11.11\"}}}, \"canCancel\": true, \"rangeDays\": 15, \"recurring\": {\"weekly\": {\"days\": [{\"slots\": [{\"time\": \"10:00\"}, {\"time\": \"11:00\"}, {\"time\": \"12:00\"}, {\"time\": \"13:00\"}, {\"time\": \"14:00\"}, {\"time\": \"15:00\"}, {\"time\": \"16:00\"}, {\"time\": \"17:00\"}]}, {\"reuse\": 0}, {\"reuse\": 0}, {\"reuse\": 0}, {\"reuse\": 0}, {\"slots\": [{\"time\": \"11:00\"}, {\"time\": \"12:00\"}, {\"time\": \"13:00\"}, {\"time\": \"14:00\"}, {\"time\": \"15:00\"}, {\"time\": \"16:00\"}]}]}}, \"description\": \"Обязательно указывайте электронный адрес, с которым вы регистрировались на портале. Будьте внимательны — записаться можно только один раз\", \"durationMinutes\": 120, \"cancellationPolicy\": \"...\", \"concurrentVisitors\": 2}}, \"timezone\": \"GMT+3\", \"toplevel\": {\"title\": \"Школа программирования Ш++\", \"endmessage\": \"Спасибо за регистрацию!\", \"description\": \"Добро пожаловать! Выберите, пожалуйста, удобную для вас дату и время\"}}}}');
/*!40000 ALTER TABLE `host` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `scheduled_events`
--

DROP TABLE IF EXISTS `scheduled_events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `scheduled_events` (
  `eventid` int(11) NOT NULL,
  `type` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `time` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userid` int(11) NOT NULL,
  `cancelledbyhost` tinyint(4) DEFAULT '0',
  `cancelledbyvisitor` tinyint(4) DEFAULT '0',
  PRIMARY KEY (`eventid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `scheduled_events`
--

LOCK TABLES `scheduled_events` WRITE;
/*!40000 ALTER TABLE `scheduled_events` DISABLE KEYS */;
/*!40000 ALTER TABLE `scheduled_events` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-12-02 15:52:53