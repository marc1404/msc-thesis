# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 94.130.100.207 (MySQL 5.7.22-0ubuntu0.16.04.1)
# Database: beerlytics
# Generation Time: 2018-06-12 18:57:09 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table beer_places
# ------------------------------------------------------------

DROP TABLE IF EXISTS `beer_places`;

CREATE TABLE `beer_places` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `beer_id` int(10) unsigned NOT NULL,
  `place_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `composite` (`beer_id`,`place_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table beer_styles
# ------------------------------------------------------------

DROP TABLE IF EXISTS `beer_styles`;

CREATE TABLE `beer_styles` (
  `id` int(11) unsigned NOT NULL,
  `name` varchar(100) NOT NULL DEFAULT '',
  `url` varchar(200) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table beer_tags
# ------------------------------------------------------------

DROP TABLE IF EXISTS `beer_tags`;

CREATE TABLE `beer_tags` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `beer_id` int(10) unsigned NOT NULL,
  `tag_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `composite` (`beer_id`,`tag_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table beer_urls_global
# ------------------------------------------------------------

DROP TABLE IF EXISTS `beer_urls_global`;

CREATE TABLE `beer_urls_global` (
  `id` int(11) unsigned NOT NULL,
  `url` varchar(200) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  UNIQUE KEY `url` (`url`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table beer_urls_nl
# ------------------------------------------------------------

DROP TABLE IF EXISTS `beer_urls_nl`;

CREATE TABLE `beer_urls_nl` (
  `id` int(11) unsigned NOT NULL,
  `url` varchar(200) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  UNIQUE KEY `url` (`url`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table beers
# ------------------------------------------------------------

DROP TABLE IF EXISTS `beers`;

CREATE TABLE `beers` (
  `id` int(11) unsigned NOT NULL,
  `name` varchar(100) NOT NULL DEFAULT '',
  `brewery_id` int(10) unsigned NOT NULL,
  `style_id` int(10) unsigned DEFAULT NULL,
  `url` varchar(200) NOT NULL DEFAULT '',
  `location` varchar(50) NOT NULL DEFAULT '',
  `image` varchar(200) NOT NULL DEFAULT '',
  `description` varchar(1000) NOT NULL DEFAULT '',
  `overall` int(10) unsigned DEFAULT NULL,
  `style` int(10) unsigned DEFAULT NULL,
  `weighted_average` float unsigned DEFAULT NULL,
  `total_ratings` int(10) unsigned DEFAULT NULL,
  `ibu` int(10) unsigned DEFAULT NULL,
  `calories` int(10) unsigned DEFAULT NULL,
  `abv` float unsigned DEFAULT NULL,
  `scraped` tinyint(1) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table breweries
# ------------------------------------------------------------

DROP TABLE IF EXISTS `breweries`;

CREATE TABLE `breweries` (
  `id` int(11) unsigned NOT NULL,
  `name` varchar(100) NOT NULL DEFAULT '',
  `url` varchar(200) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table places
# ------------------------------------------------------------

DROP TABLE IF EXISTS `places`;

CREATE TABLE `places` (
  `id` int(11) unsigned NOT NULL,
  `slug` varchar(100) NOT NULL DEFAULT '',
  `name` varchar(100) NOT NULL DEFAULT '',
  `type` varchar(15) NOT NULL DEFAULT '',
  `street` varchar(50) NOT NULL DEFAULT '',
  `locality` varchar(50) NOT NULL DEFAULT '',
  `region` varchar(50) NOT NULL DEFAULT '',
  `country` varchar(50) NOT NULL DEFAULT '',
  `postal_code` varchar(10) NOT NULL DEFAULT '',
  `rating_count` int(10) unsigned NOT NULL,
  `rating_value` float unsigned DEFAULT NULL,
  `facebook_url` varchar(200) DEFAULT NULL,
  `twitter_url` varchar(200) DEFAULT NULL,
  `website_url` varchar(200) DEFAULT NULL,
  `telephone` varchar(30) DEFAULT NULL,
  `opening_times` varchar(100) DEFAULT NULL,
  `image_url` varchar(200) DEFAULT NULL,
  `scraped_beers` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table review_clusters
# ------------------------------------------------------------

DROP TABLE IF EXISTS `review_clusters`;

CREATE TABLE `review_clusters` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `review_id` int(10) unsigned NOT NULL,
  `embedding` varchar(10) NOT NULL,
  `cluster` tinyint(3) unsigned NOT NULL,
  `is_centroid` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `composite` (`review_id`,`embedding`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table reviews
# ------------------------------------------------------------

DROP TABLE IF EXISTS `reviews`;

CREATE TABLE `reviews` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `beer_id` int(10) unsigned NOT NULL,
  `user_id` int(10) unsigned NOT NULL,
  `date` date DEFAULT NULL,
  `location` varchar(150) NOT NULL DEFAULT '',
  `text` varchar(10100) NOT NULL DEFAULT '',
  `score` float unsigned NOT NULL,
  `aroma` int(10) unsigned DEFAULT NULL,
  `appearance` int(10) unsigned DEFAULT NULL,
  `taste` int(11) unsigned DEFAULT NULL,
  `palate` int(11) unsigned DEFAULT NULL,
  `overall` int(11) unsigned DEFAULT NULL,
  `language` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `composite` (`beer_id`,`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table tags
# ------------------------------------------------------------

DROP TABLE IF EXISTS `tags`;

CREATE TABLE `tags` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table users
# ------------------------------------------------------------

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int(11) unsigned NOT NULL,
  `name` varchar(100) NOT NULL DEFAULT '',
  `total_ratings` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;




/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
