CREATE TABLE IF NOT EXISTS `goods` (
	`id` int(11) NOT NULL AUTO_INCREMENT,
	`name` varchar(255) DEFAULT NULL,
	`price` varchar(255) DEFAULT NULL,
	`createtime` varchar(20) DEFAULT NULL,
	`modifiedtime` varchar(20) DEFAULT NULL,
	PRIMARY KEY (`id`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;