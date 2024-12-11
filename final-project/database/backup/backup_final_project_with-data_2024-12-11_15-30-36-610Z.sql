/*M!999999\- enable the sandbox mode */ 
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
  UNIQUE KEY `fileName` (`fileName`)
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
  UNIQUE KEY `description` (`description`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `locations`
--

LOCK TABLES `locations` WRITE;
/*!40000 ALTER TABLE `locations` DISABLE KEYS */;
INSERT INTO `locations` VALUES (1,'Miami, USA','Point','\0\0\0\0\0\0\0û<FyæTÀDÛ1uWÆ9@','2024-12-11 08:10:16','2024-12-11 08:10:16'),(2,'Lummus Park Beach','Point','\0\0\0\0\0\0\0ÑZÑæ8TÀ¥£Ì&È9@','2024-12-11 08:10:17','2024-12-11 08:10:17'),(3,'Islamorada','Point','\0\0\0\0\0\0\0j¤¥òv)TÀä†ßM·è8@','2024-12-11 08:10:17','2024-12-11 08:10:17'),(4,'Sombrero Beach','Point','\0\0\0\0\0\0\0i\0oETÀ\r6uµ8@','2024-12-11 08:10:17','2024-12-11 08:10:17'),(5,'West Key','Point','\0\0\0\0\0\0\04-±2qTÀFzQ»_8@','2024-12-11 08:10:17','2024-12-11 08:10:17'),(6,'Aspen, USA','Point','\0\0\0\0\0\0\0`:­Û ´ZÀnÜb~n˜C@','2024-12-11 08:10:17','2024-12-11 08:10:17'),(7,'Aspen Highlands','Point','\0\0\0\0\0\0\0Kº ¾¶ZÀž]¾õa—C@','2024-12-11 08:10:17','2024-12-11 08:10:17'),(8,'Beaver Creek','Point','\0\0\0\0\0\0\0!WêY¡ZÀ\Z4ôOpÍC@','2024-12-11 08:10:17','2024-12-11 08:10:17'),(9,'Las Vegas, USA','Point','\0\0\0\0\0\0\0²eùºË\\Ào.\Z2B@','2024-12-11 08:10:17','2024-12-11 08:10:17'),(10,'Zion Canyon National Park','Point','\0\0\0\0\0\0\0Õ^DÛ1?\\ÀÂõ(\\™B@','2024-12-11 08:10:17','2024-12-11 08:10:17'),(11,'Antelope Canyon','Point','\0\0\0\0\0\0\0öA–Ø[À‚¨û\0¤nB@','2024-12-11 08:10:17','2024-12-11 08:10:17'),(12,'Grand Canyon National Park','Point','\0\0\0\0\0\0\0Å6©h\\Àk,amŒB@','2024-12-11 08:10:17','2024-12-11 08:10:17'),(13,'Joshua Tree National Park','Point','\0\0\0\0\0\0\0e‹¤Ýè]ÀŠº}A@','2024-12-11 08:10:18','2024-12-11 08:10:18');
/*!40000 ALTER TABLE `locations` ENABLE KEYS */;
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
  CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
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
  `description` varchar(500) NOT NULL,
  `imageCover` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `tours_slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tours`
--

LOCK TABLES `tours` WRITE;
/*!40000 ALTER TABLE `tours` DISABLE KEYS */;
INSERT INTO `tours` VALUES (1,'The Forest Hiker','the-forest-hiker',10,'2025-12-05 18:52:50',20,'easy',4.75,4,1000,15,'Breathtaking hike through the Canadian Banff National Park','Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.','tour-1-cover.jpg','2024-12-11 08:11:59','2024-12-11 08:25:01'),(2,'The Snow Adventurer','the-snow-adventurer',16,'2025-03-03 18:52:50',5,'difficult',4.5,4,1234,13,'Exciting adventure in the snow with snowboarding and skiing','Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua, ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum! Dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur, exercitation ullamco laboris nisi ut aliquip. Lorem ipsum dolor sit amet, consectetur adipisicing elit!','tour-3-cover.jpg','2024-12-11 08:11:59','2024-12-11 08:25:07'),(3,'The Sea Explorer','the-sea-explorer',21,'2025-07-05 18:52:50',8,'medium',4.25,4,789,10,'Exploring the jaw-dropping US east coast by foot and by boat','Consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet!','tour-2-cover.jpg','2024-12-11 08:15:16','2024-12-11 14:20:30');
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
INSERT INTO `tours_to_images` VALUES (1,1),(1,2),(1,3),(2,7),(2,8),(2,9),(3,4),(3,5),(3,6);
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
INSERT INTO `tours_to_locations` VALUES (1,1),(1,2),(1,3),(2,7),(2,8),(2,9),(3,4),(3,5),(3,6);
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
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Viktoryia','admin@gmail.com','user-4.jpg','admin','$2a$12$Cm.5YVQxVOtmMTq.yx3beeNQnT5h/kupUsVK0IKet5gHRw.Plsl0S','2024-12-11 08:08:02',NULL,NULL,1,'2024-12-11 08:08:03','2024-12-11 08:41:31'),(2,'Haven Grimes','Randi34@hotmail.com',NULL,'user','$2a$12$nj2iNuP9E1B1NoVCdnktH.uaI4MCOfRK0XiuSmk14YDVsh3vlsSNu','2024-12-11 08:09:50',NULL,NULL,1,'2024-12-11 08:09:51','2024-12-11 08:09:51'),(3,'Qwerty','Uriah14@yahoo.com','user-3.jpeg','admin','$2a$12$WYl17NCWjS21aO24DidlVez.20rjZPRHiX0E/OaXWP1EatG/t/uf6','2024-12-11 08:09:54',NULL,NULL,1,'2024-12-11 08:09:55','2024-12-11 13:58:10'),(4,'Bridgette Sdortze','Kenyatta_Lakin5@hotmail.com',NULL,'user','$2a$12$sb3asYJY139L5AEsY7NxrO0rl.LYgCpxcBg9yvh9eb9SicN5QAYOG','2024-12-11 08:22:43',NULL,NULL,1,'2024-12-11 08:22:44','2024-12-11 08:22:44'),(5,'Kristen White ','user@gmail.com','user-5.jpeg','user','$2a$12$OKoC93dG1OFOZvIvISNvf./K5VtOvjQEsjpwlno7yzlBPlwE8Yhvy','2024-12-11 08:56:38',NULL,NULL,1,'2024-12-11 08:24:05','2024-12-11 13:31:23'),(6,'Ringo Pixel','Astrid_Wehner36@hotmail.com','user-6.jpeg','admin','$2a$12$OoPZul8KbatCBFDmwEJCBOr6i8xSfNHYgsUSHWCDuKa783.HGG7Si','2024-12-11 08:24:48',NULL,NULL,1,'2024-12-11 08:24:49','2024-12-11 14:01:32');
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

-- Dump completed on 2024-12-11 18:30:42
