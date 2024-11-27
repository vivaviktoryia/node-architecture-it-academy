-- MySQL dump 10.13  Distrib 8.0.23, for Win64 (x86_64)
--
-- Host: localhost    Database: learning_db
-- ------------------------------------------------------
-- Server version	5.5.5-10.6.20-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `learning_db`
--

/*!40000 DROP DATABASE IF EXISTS `learning_db`*/;

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `learning_db` /*!40100 DEFAULT CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci */;

USE `learning_db`;

--
-- Table structure for table `courses`
--

DROP TABLE IF EXISTS `courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `courses` (
  `id` int(5) unsigned NOT NULL AUTO_INCREMENT,
  `parent_course` int(5) NOT NULL DEFAULT -1 COMMENT 'родительский курс',
  `parent_ord` int(5) NOT NULL DEFAULT 0 COMMENT 'порядок в родительском курсе',
  `name` varchar(100) NOT NULL DEFAULT '' COMMENT 'название',
  `comment` varchar(100) NOT NULL DEFAULT '' COMMENT 'комментарий',
  `code` varchar(10) NOT NULL DEFAULT '' COMMENT 'код курса',
  `learn_level` smallint(5) unsigned NOT NULL DEFAULT 0 COMMENT 'уровень обучения -> learn_levels',
  `learn_dir` smallint(5) unsigned NOT NULL DEFAULT 0 COMMENT 'направление обучения -> learn_dirs',
  `anons` text NOT NULL COMMENT 'анонс курса',
  `hours` smallint(5) unsigned NOT NULL DEFAULT 0 COMMENT 'продолжительность курса в часах',
  PRIMARY KEY (`id`),
  KEY `courses_n_i` (`name`),
  KEY `courses_pc_i` (`parent_course`,`parent_ord`)
) ENGINE=MyISAM AUTO_INCREMENT=124 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC COMMENT='курсы';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `grups`
--

DROP TABLE IF EXISTS `grups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `grups` (
  `id` int(5) unsigned NOT NULL AUTO_INCREMENT,
  `learn_form` smallint(5) unsigned NOT NULL DEFAULT 0 COMMENT 'форма обучения -> learn_forms',
  `name` varchar(100) NOT NULL DEFAULT '' COMMENT 'название',
  `course` int(10) unsigned NOT NULL DEFAULT 0 COMMENT 'по какому курсу обучение -> courses',
  `teacher` int(10) unsigned NOT NULL DEFAULT 0 COMMENT 'преподаватель -> teacher',
  `lessons_time_str` text DEFAULT NULL COMMENT 'время занятий текстом',
  `lessons_start_dat` datetime DEFAULT NULL COMMENT 'дата начала обучения',
  `lessons_end_dat` datetime DEFAULT NULL COMMENT 'дата окончания обучения',
  `enable_accept` smallint(5) unsigned NOT NULL DEFAULT 0 COMMENT 'разрешить приём заявок',
  PRIMARY KEY (`id`),
  KEY `grups_c_ea_lsd_i` (`course`,`enable_accept`,`lessons_start_dat`)
) ENGINE=MyISAM AUTO_INCREMENT=363 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC COMMENT='группы';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `grups_students`
--

DROP TABLE IF EXISTS `grups_students`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `grups_students` (
  `id` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `grup` int(10) unsigned NOT NULL DEFAULT 0 COMMENT 'в какой группе -> grups',
  `person` int(10) unsigned NOT NULL DEFAULT 0 COMMENT 'какой студент обучается -> persons',
  PRIMARY KEY (`id`),
  KEY `grups_students_g_i` (`grup`),
  KEY `grups_students_p_i` (`person`)
) ENGINE=MyISAM AUTO_INCREMENT=2047 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC COMMENT='группы: студенты';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `learn_dirs`
--

DROP TABLE IF EXISTS `learn_dirs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `learn_dirs` (
  `id` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL DEFAULT '' COMMENT 'название',
  `ord` smallint(6) NOT NULL DEFAULT 0 COMMENT 'порядок',
  PRIMARY KEY (`id`),
  KEY `learn_dirs_o_i` (`ord`)
) ENGINE=MyISAM AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci COMMENT='направления обучения';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `learn_forms`
--

DROP TABLE IF EXISTS `learn_forms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `learn_forms` (
  `id` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL DEFAULT '' COMMENT 'название',
  `comment` varchar(50) NOT NULL DEFAULT '' COMMENT 'комментарий',
  `ord` smallint(6) NOT NULL DEFAULT 0 COMMENT 'порядок',
  PRIMARY KEY (`id`),
  KEY `learn_forms_o_i` (`ord`)
) ENGINE=MyISAM AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci ROW_FORMAT=DYNAMIC COMMENT='формы обучения';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `learn_levels`
--

DROP TABLE IF EXISTS `learn_levels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `learn_levels` (
  `id` smallint(5) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL DEFAULT '' COMMENT 'название',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=31 DEFAULT CHARSET=cp1251 COLLATE=cp1251_general_ci ROW_FORMAT=DYNAMIC COMMENT='уровни обучения';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `persons`
--

DROP TABLE IF EXISTS `persons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `persons` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `fam` varchar(50) NOT NULL DEFAULT '',
  `im` varchar(50) NOT NULL DEFAULT '',
  `otch` varchar(50) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  KEY `persons_f_i` (`fam`)
) ENGINE=MyISAM AUTO_INCREMENT=1550 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci COMMENT='персоны';
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-27 21:20:03
