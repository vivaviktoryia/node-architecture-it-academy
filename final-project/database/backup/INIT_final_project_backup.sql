/*M!999999-- enable the sandbox mode */ 
-- MariaDB dump 10.19  Distrib 10.6.20-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: final_project
-- ------------------------------------------------------
-- Server version	10.6.20-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `final_project`
--

/*!40000 DROP DATABASE IF EXISTS `final_project`*/;

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `final_project` /*!40100 DEFAULT CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci */;

USE `final_project`;

--
-- Table structure for table `images`
--

DROP TABLE IF EXISTS `images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `images` (
  `id` smallint(6) NOT NULL AUTO_INCREMENT,
  `fileName` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `fileName` (`fileName`),
  UNIQUE KEY `fileName_2` (`fileName`),
  UNIQUE KEY `fileName_3` (`fileName`),
  UNIQUE KEY `fileName_4` (`fileName`),
  UNIQUE KEY `fileName_5` (`fileName`),
  UNIQUE KEY `fileName_6` (`fileName`),
  UNIQUE KEY `fileName_7` (`fileName`),
  UNIQUE KEY `fileName_8` (`fileName`),
  UNIQUE KEY `fileName_9` (`fileName`),
  UNIQUE KEY `fileName_10` (`fileName`),
  UNIQUE KEY `fileName_11` (`fileName`),
  UNIQUE KEY `fileName_12` (`fileName`),
  UNIQUE KEY `fileName_13` (`fileName`),
  UNIQUE KEY `fileName_14` (`fileName`),
  UNIQUE KEY `fileName_15` (`fileName`),
  UNIQUE KEY `fileName_16` (`fileName`),
  UNIQUE KEY `fileName_17` (`fileName`),
  UNIQUE KEY `fileName_18` (`fileName`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `images`
--

LOCK TABLES `images` WRITE;
/*!40000 ALTER TABLE `images` DISABLE KEYS */;
INSERT INTO `images` VALUES (1,'tour-1-1.jpg','2024-12-11 08:10:43','2024-12-11 08:10:43'),(2,'tour-1-2.jpg','2024-12-11 08:10:43','2024-12-11 08:10:43'),(3,'tour-1-3.jpg','2024-12-11 08:10:44','2024-12-11 08:10:44'),(4,'tour-2-1.jpg','2024-12-11 08:10:44','2024-12-11 08:10:44'),(5,'tour-2-2.jpg','2024-12-11 08:10:44','2024-12-11 08:10:44'),(6,'tour-2-3.jpg','2024-12-11 08:10:44','2024-12-11 08:10:44'),(7,'tour-3-1.jpg','2024-12-11 08:10:44','2024-12-11 08:10:44'),(8,'tour-3-2.jpg','2024-12-11 08:10:44','2024-12-11 08:10:44'),(9,'tour-3-3.jpg','2024-12-11 08:10:44','2024-12-11 08:10:44');
/*!40000 ALTER TABLE `images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `locations`
--

DROP TABLE IF EXISTS `locations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `locations` (
  `id` smallint(6) NOT NULL AUTO_INCREMENT,
  `description` varchar(255) NOT NULL,
  `type` char(255) NOT NULL DEFAULT 'Point',
  `coordinates` point NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `description` (`description`),
  UNIQUE KEY `description_2` (`description`),
  UNIQUE KEY `description_3` (`description`),
  UNIQUE KEY `description_4` (`description`),
  UNIQUE KEY `description_5` (`description`),
  UNIQUE KEY `description_6` (`description`),
  UNIQUE KEY `description_7` (`description`),
  UNIQUE KEY `description_8` (`description`),
  UNIQUE KEY `description_9` (`description`),
  UNIQUE KEY `description_10` (`description`),
  UNIQUE KEY `description_11` (`description`),
  UNIQUE KEY `description_12` (`description`),
  UNIQUE KEY `description_13` (`description`),
  UNIQUE KEY `description_14` (`description`),
  UNIQUE KEY `description_15` (`description`),
  UNIQUE KEY `description_16` (`description`),
  UNIQUE KEY `description_17` (`description`),
  UNIQUE KEY `description_18` (`description`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `locations`
--

LOCK TABLES `locations` WRITE;
/*!40000 ALTER TABLE `locations` DISABLE KEYS */;
INSERT INTO `locations` VALUES (1,'Miami, USA','Point','\0\0\0\0\0\0\0�<Fy�T�D�1uW�9@','2024-12-11 08:10:16','2024-12-11 08:10:16'),(2,'Lummus Park Beach','Point','\0\0\0\0\0\0\0�Z��8T����&�9@','2024-12-11 08:10:17','2024-12-11 08:10:17'),(3,'Islamorada','Point','\0\0\0\0\0\0\0j���v)T���M��8@','2024-12-11 08:10:17','2024-12-11 08:10:17'),(4,'Sombrero Beach','Point','\0\0\0\0\0\0\0i\0o�ET�\r6u�8@','2024-12-11 08:10:17','2024-12-11 08:10:17'),(5,'West Key','Point','\0\0\0\0\0\0\04-�2qT�FzQ�_�8@','2024-12-11 08:10:17','2024-12-11 08:10:17'),(6,'Aspen, USA','Point','\0\0\0\0\0\0\0`:�۠�Z�n�b~n�C@','2024-12-11 08:10:17','2024-12-11 08:10:17'),(7,'Aspen Highlands','Point','\0\0\0\0\0\0\0K����Z��]��a�C@','2024-12-11 08:10:17','2024-12-11 08:10:17'),(8,'Beaver Creek','Point','\0\0\0\0\0\0\0!W�Y�Z�\Z4�Op�C@','2024-12-11 08:10:17','2024-12-11 08:10:17'),(9,'Las Vegas, USA','Point','\0\0\0\0\0\0\0�e���\\�o.\Z2B@','2024-12-11 08:10:17','2024-12-11 08:10:17'),(10,'Zion Canyon National Park','Point','\0\0\0\0\0\0\0�^D�1?\\����(\\�B@','2024-12-11 08:10:17','2024-12-11 08:10:17'),(11,'Antelope Canyon','Point','\0\0\0\0\0\0\0�A��[����\0�nB@','2024-12-11 08:10:17','2024-12-11 08:10:17'),(12,'Grand Canyon National Park','Point','\0\0\0\0\0\0\0��6�h\\�k,am�B@','2024-12-11 08:10:17','2024-12-11 08:10:17'),(13,'Joshua Tree National Park','Point','\0\0\0\0\0\0\0e����]�����}A@','2024-12-11 08:10:18','2024-12-11 08:10:18');
/*!40000 ALTER TABLE `locations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pages`
--

DROP TABLE IF EXISTS `pages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pages` (
  `id` smallint(6) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `name_2` (`name`),
  UNIQUE KEY `name_3` (`name`),
  UNIQUE KEY `name_4` (`name`),
  UNIQUE KEY `name_5` (`name`),
  UNIQUE KEY `name_6` (`name`),
  UNIQUE KEY `name_7` (`name`),
  UNIQUE KEY `name_8` (`name`),
  UNIQUE KEY `name_9` (`name`),
  UNIQUE KEY `name_10` (`name`),
  UNIQUE KEY `name_11` (`name`),
  UNIQUE KEY `name_12` (`name`),
  UNIQUE KEY `name_13` (`name`),
  UNIQUE KEY `name_14` (`name`),
  UNIQUE KEY `name_15` (`name`),
  UNIQUE KEY `name_16` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pages`
--

LOCK TABLES `pages` WRITE;
/*!40000 ALTER TABLE `pages` DISABLE KEYS */;
INSERT INTO `pages` VALUES (1,'overview','2024-12-13 16:39:44','2024-12-13 16:39:45');
/*!40000 ALTER TABLE `pages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins`
--

DROP TABLE IF EXISTS `plugins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `plugins` (
  `id` smallint(6) NOT NULL AUTO_INCREMENT,
  `type` enum('tour','greeting','advertisement') NOT NULL,
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`content`)),
  `order` smallint(6) NOT NULL,
  `active` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `type` (`type`),
  UNIQUE KEY `type_2` (`type`),
  UNIQUE KEY `type_3` (`type`),
  UNIQUE KEY `type_4` (`type`),
  UNIQUE KEY `type_5` (`type`),
  UNIQUE KEY `type_6` (`type`),
  UNIQUE KEY `type_7` (`type`),
  UNIQUE KEY `type_8` (`type`),
  UNIQUE KEY `type_9` (`type`),
  UNIQUE KEY `type_10` (`type`),
  UNIQUE KEY `type_11` (`type`),
  UNIQUE KEY `type_12` (`type`),
  UNIQUE KEY `type_13` (`type`),
  UNIQUE KEY `type_14` (`type`),
  UNIQUE KEY `type_15` (`type`),
  UNIQUE KEY `type_16` (`type`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins`
--

LOCK TABLES `plugins` WRITE;
/*!40000 ALTER TABLE `plugins` DISABLE KEYS */;
INSERT INTO `plugins` VALUES (1,'advertisement','{\"text\":\"Special Offer: Save 20% on your first booking!\",\"link\":\"/bookings\",\"linkText\":\"Book Now\"}',3,1,'2024-12-13 13:41:12','2024-12-13 13:43:16'),(2,'greeting','{\"title\":\"Hello, Traveler!\",\"message\":\"Explore the best tours around the world.\"}',1,1,'2024-12-13 13:41:12','2024-12-13 13:43:16'),(3,'tour','{\"count\":3,\"header\":\"Tour Information\",\"text\":\"Exciting details about this tour.\",\"footerValue\":\"From $999\",\"link\":\"/overview\"}',2,1,'2024-12-13 13:41:12','2024-12-13 13:43:16');
/*!40000 ALTER TABLE `plugins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_to_pages`
--

DROP TABLE IF EXISTS `plugins_to_pages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `plugins_to_pages` (
  `pluginId` smallint(6) NOT NULL,
  `pageId` smallint(6) NOT NULL,
  PRIMARY KEY (`pluginId`,`pageId`),
  KEY `pageId` (`pageId`),
  CONSTRAINT `plugins_to_pages_ibfk_1` FOREIGN KEY (`pluginId`) REFERENCES `plugins` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `plugins_to_pages_ibfk_2` FOREIGN KEY (`pageId`) REFERENCES `pages` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_to_pages`
--

LOCK TABLES `plugins_to_pages` WRITE;
/*!40000 ALTER TABLE `plugins_to_pages` DISABLE KEYS */;
INSERT INTO `plugins_to_pages` VALUES (1,1),(2,1),(3,1);
/*!40000 ALTER TABLE `plugins_to_pages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reviews` (
  `id` smallint(6) NOT NULL AUTO_INCREMENT,
  `review` text NOT NULL,
  `rating` tinyint(4) NOT NULL,
  `tourId` smallint(6) NOT NULL,
  `userId` smallint(6) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `reviews_tour_id_user_id` (`tourId`,`userId`),
  KEY `userId` (`userId`),
  CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`tourId`) REFERENCES `tours` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_10` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_11` FOREIGN KEY (`tourId`) REFERENCES `tours` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_12` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_13` FOREIGN KEY (`tourId`) REFERENCES `tours` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_14` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_15` FOREIGN KEY (`tourId`) REFERENCES `tours` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_16` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_17` FOREIGN KEY (`tourId`) REFERENCES `tours` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_18` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_19` FOREIGN KEY (`tourId`) REFERENCES `tours` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_20` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_21` FOREIGN KEY (`tourId`) REFERENCES `tours` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_22` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_23` FOREIGN KEY (`tourId`) REFERENCES `tours` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_24` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_25` FOREIGN KEY (`tourId`) REFERENCES `tours` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_26` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_27` FOREIGN KEY (`tourId`) REFERENCES `tours` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_28` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_29` FOREIGN KEY (`tourId`) REFERENCES `tours` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_3` FOREIGN KEY (`tourId`) REFERENCES `tours` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_30` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_31` FOREIGN KEY (`tourId`) REFERENCES `tours` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_32` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_33` FOREIGN KEY (`tourId`) REFERENCES `tours` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_34` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_4` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_5` FOREIGN KEY (`tourId`) REFERENCES `tours` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_6` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_7` FOREIGN KEY (`tourId`) REFERENCES `tours` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_8` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_9` FOREIGN KEY (`tourId`) REFERENCES `tours` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
INSERT INTO `reviews` VALUES (1,'De-engineered human-resource help-desk',5,3,3,'2024-12-11 08:19:50','2024-12-11 08:19:50'),(2,'Amazing Tour!',4,2,3,'2024-12-11 08:21:12','2024-12-11 08:21:12'),(3,'Eum nobis dolores numquam culpa omnis numquam eaque.',5,1,3,'2024-12-11 08:22:11','2024-12-11 08:22:11'),(4,'Rem vel velit quas nihil culpa eveniet et quaerat maxime.',4,1,4,'2024-12-11 08:23:32','2024-12-11 08:23:32'),(5,'Molestiae deserunt deleniti sed qui explicabo in.',4,2,4,'2024-12-11 08:23:38','2024-12-11 08:23:38'),(6,'Aperiam molestiae dolore fugit exercitationem harum veritatis nobis nobis sint.',4,3,4,'2024-12-11 08:23:42','2024-12-11 08:23:42'),(7,'Quia asperiores est dicta harum est.',5,3,5,'2024-12-11 08:24:28','2024-12-11 08:24:28'),(8,'Tempore delectus hic.',5,2,5,'2024-12-11 08:24:34','2024-12-11 08:24:34'),(9,'Sint aperiam a odio exercitationem ea quas fugit.',5,1,5,'2024-12-11 08:24:38','2024-12-11 08:24:38'),(10,'Dolorem nulla fugit qui quidem autem ea.',5,1,6,'2024-12-11 08:25:01','2024-12-11 08:25:01'),(11,'Consequuntur et asperiores et sit et sit autem maxime.',5,2,6,'2024-12-11 08:25:06','2024-12-11 08:25:06'),(13,'Est blanditiis vel recusandae quo eius nostrum.',3,3,6,'2024-12-11 08:25:19','2024-12-11 08:25:19');
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tours`
--

DROP TABLE IF EXISTS `tours`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tours` (
  `id` smallint(6) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `duration` smallint(6) NOT NULL,
  `startDate` datetime NOT NULL,
  `maxGroupSize` smallint(6) NOT NULL,
  `difficulty` enum('easy','medium','difficult') NOT NULL,
  `ratingsAverage` float DEFAULT 4.5,
  `ratingsQuantity` smallint(6) DEFAULT 0,
  `price` float NOT NULL,
  `priceDiscount` float DEFAULT NULL,
  `summary` varchar(255) NOT NULL,
  `description` varchar(700) NOT NULL,
  `imageCover` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `name_2` (`name`),
  UNIQUE KEY `name_3` (`name`),
  UNIQUE KEY `name_4` (`name`),
  UNIQUE KEY `name_5` (`name`),
  UNIQUE KEY `name_6` (`name`),
  UNIQUE KEY `name_7` (`name`),
  UNIQUE KEY `name_8` (`name`),
  UNIQUE KEY `name_9` (`name`),
  UNIQUE KEY `name_10` (`name`),
  UNIQUE KEY `name_11` (`name`),
  UNIQUE KEY `name_12` (`name`),
  UNIQUE KEY `name_13` (`name`),
  UNIQUE KEY `name_14` (`name`),
  UNIQUE KEY `name_15` (`name`),
  UNIQUE KEY `name_16` (`name`),
  UNIQUE KEY `name_17` (`name`),
  UNIQUE KEY `name_18` (`name`),
  UNIQUE KEY `name_19` (`name`),
  UNIQUE KEY `name_20` (`name`),
  KEY `tours_slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tours`
--

LOCK TABLES `tours` WRITE;
/*!40000 ALTER TABLE `tours` DISABLE KEYS */;
INSERT INTO `tours` VALUES (1,'The Forest Hiker','the-forest-hiker',10,'2025-12-05 18:52:50',20,'easy',4.75,4,1000,15,'Breathtaking hike through the Canadian Banff National Park','Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.','tour-1-cover.jpg','2024-12-11 08:11:59','2024-12-11 08:25:01'),(2,'The Snow Adventurer','the-snow-adventurer',16,'2025-03-03 18:52:50',5,'difficult',4.5,4,1234,13,'Exciting adventure in the snow with snowboarding and skiing','Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua, ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum! Dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur, exercitation ullamco laboris nisi ut aliquip. Lorem ipsum dolor sit amet, consectetur adipisicing elit!','tour-3-cover.jpg','2024-12-11 08:11:59','2024-12-11 08:25:07'),(3,'The Sea Explorer','the-sea-explorer',21,'2025-07-05 18:52:50',8,'medium',4.25,4,789,10,'Exploring the jaw-dropping US east coast by foot and by boat','Consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet!','tour-2-cover.jpg','2024-12-11 08:15:16','2024-12-11 14:20:30'),(4,'TEST Default Tour Name','test-default-tour-name',17,'2024-12-27 00:00:00',71,'easy',4.5,0,121,0,'Enjoy the Northern Lights in one of the best places in the world','<p>Sed do eiusmod&nbsp;<strong>tempor&nbsp;</strong>incididunt ut labore et dolore magna aliqua:</p>\n<ul>\n<li>ut enim ad&nbsp;<strong>minim&nbsp;</strong>veniam, quis nostrud exercitation ullamco laboris nisi<em>&nbsp;ut aliquip ex ea commodo&nbsp;</em>consequat. cupidatat non proident, sunt in culpa qui&nbsp;<em>officia&nbsp;</em>deserunt mollit anim id&nbsp;est laborum!</li>\n<li>Dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur, exercitation ullamco laboris nisi ut aliquip.</li>\n</ul>\n<p><strong>Lorem ipsum dolor sit amet, consectetur adipisicing elit!</strong></p>','default-cover.jpg','2024-12-13 13:56:39','2024-12-13 13:56:39');
/*!40000 ALTER TABLE `tours` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tours_to_images`
--

DROP TABLE IF EXISTS `tours_to_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tours_to_images` (
  `tourId` smallint(6) NOT NULL,
  `imageId` smallint(6) NOT NULL,
  PRIMARY KEY (`tourId`,`imageId`),
  KEY `imageId` (`imageId`),
  CONSTRAINT `tours_to_images_ibfk_1` FOREIGN KEY (`tourId`) REFERENCES `tours` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `tours_to_images_ibfk_2` FOREIGN KEY (`imageId`) REFERENCES `images` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tours_to_images`
--

LOCK TABLES `tours_to_images` WRITE;
/*!40000 ALTER TABLE `tours_to_images` DISABLE KEYS */;
INSERT INTO `tours_to_images` VALUES (1,1),(1,2),(1,3),(2,7),(2,8),(2,9),(3,4),(3,5),(3,6),(4,2),(4,3),(4,4);
/*!40000 ALTER TABLE `tours_to_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tours_to_locations`
--

DROP TABLE IF EXISTS `tours_to_locations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tours_to_locations` (
  `tourId` smallint(6) NOT NULL,
  `locationId` smallint(6) NOT NULL,
  PRIMARY KEY (`tourId`,`locationId`),
  KEY `locationId` (`locationId`),
  CONSTRAINT `tours_to_locations_ibfk_1` FOREIGN KEY (`tourId`) REFERENCES `tours` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `tours_to_locations_ibfk_2` FOREIGN KEY (`locationId`) REFERENCES `locations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tours_to_locations`
--

LOCK TABLES `tours_to_locations` WRITE;
/*!40000 ALTER TABLE `tours_to_locations` DISABLE KEYS */;
INSERT INTO `tours_to_locations` VALUES (1,1),(1,2),(1,3),(2,7),(2,8),(2,9),(3,4),(3,5),(3,6),(4,11),(4,12),(4,13);
/*!40000 ALTER TABLE `tours_to_locations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` smallint(6) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `role` enum('user','admin') DEFAULT 'user',
  `password` varchar(255) NOT NULL,
  `passwordChangedAt` datetime DEFAULT NULL,
  `passwordResetToken` varchar(255) DEFAULT NULL,
  `passwordResetExpires` datetime DEFAULT NULL,
  `active` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `email_2` (`email`),
  UNIQUE KEY `email_3` (`email`),
  UNIQUE KEY `email_4` (`email`),
  UNIQUE KEY `email_5` (`email`),
  UNIQUE KEY `email_6` (`email`),
  UNIQUE KEY `email_7` (`email`),
  UNIQUE KEY `email_8` (`email`),
  UNIQUE KEY `email_9` (`email`),
  UNIQUE KEY `email_10` (`email`),
  UNIQUE KEY `email_11` (`email`),
  UNIQUE KEY `email_12` (`email`),
  UNIQUE KEY `email_13` (`email`),
  UNIQUE KEY `email_14` (`email`),
  UNIQUE KEY `email_15` (`email`),
  UNIQUE KEY `email_16` (`email`),
  UNIQUE KEY `email_17` (`email`),
  UNIQUE KEY `email_18` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Viktoryia','admin@gmail.com','user-4.jpeg','admin','$2a$12$Cm.5YVQxVOtmMTq.yx3beeNQnT5h/kupUsVK0IKet5gHRw.Plsl0S','2024-12-11 08:08:02',NULL,NULL,1,'2024-12-11 08:08:03','2024-12-11 08:41:31'),(2,'Haven Grimes','Randi34@hotmail.com',NULL,'user','$2a$12$nj2iNuP9E1B1NoVCdnktH.uaI4MCOfRK0XiuSmk14YDVsh3vlsSNu','2024-12-11 08:09:50',NULL,NULL,1,'2024-12-11 08:09:51','2024-12-11 08:09:51'),(3,'Qwerty','Uriah14@yahoo.com','user-3.jpeg','admin','$2a$12$WYl17NCWjS21aO24DidlVez.20rjZPRHiX0E/OaXWP1EatG/t/uf6','2024-12-11 08:09:54',NULL,NULL,1,'2024-12-11 08:09:55','2024-12-11 13:58:10'),(4,'Bridgette Sdortze','Kenyatta_Lakin5@hotmail.com',NULL,'user','$2a$12$sb3asYJY139L5AEsY7NxrO0rl.LYgCpxcBg9yvh9eb9SicN5QAYOG','2024-12-11 08:22:43',NULL,NULL,1,'2024-12-11 08:22:44','2024-12-11 08:22:44'),(5,'Kristen White ','user@gmail.com','user-5.jpeg','user','$2a$12$OKoC93dG1OFOZvIvISNvf./K5VtOvjQEsjpwlno7yzlBPlwE8Yhvy','2024-12-11 08:56:38',NULL,NULL,1,'2024-12-11 08:24:05','2024-12-11 13:31:23'),(6,'Ringo Pixel','Astrid_Wehner36@hotmail.com','user-6.jpeg','admin','$2a$12$OoPZul8KbatCBFDmwEJCBOr6i8xSfNHYgsUSHWCDuKa783.HGG7Si','2024-12-11 08:24:48',NULL,NULL,1,'2024-12-11 08:24:49','2024-12-11 14:01:32'),(7,'Ervin Walsh','Laron21@yahoo.com',NULL,'admin','$2a$12$MBQOAcUSKuc8rMaB1D5JYejJCjXe7j66c9fWERUQEm1lQN163C2Hq','2024-12-13 13:40:52',NULL,NULL,1,'2024-12-13 13:40:53','2024-12-13 13:40:53');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_to_tours`
--

DROP TABLE IF EXISTS `users_to_tours`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users_to_tours` (
  `tourId` smallint(6) NOT NULL,
  `userId` smallint(6) NOT NULL,
  PRIMARY KEY (`tourId`,`userId`),
  KEY `userId` (`userId`),
  CONSTRAINT `users_to_tours_ibfk_1` FOREIGN KEY (`tourId`) REFERENCES `tours` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `users_to_tours_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_to_tours`
--

LOCK TABLES `users_to_tours` WRITE;
/*!40000 ALTER TABLE `users_to_tours` DISABLE KEYS */;
/*!40000 ALTER TABLE `users_to_tours` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-13 17:23:24
