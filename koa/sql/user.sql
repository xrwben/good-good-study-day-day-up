CREATE TABLE IF NOT EXISTS `user` (
	`id` int(11) NOT NULL AUTO_INCREMENT,
	`name` varchar(255) DEFAULT NULL,
	`password` varchar(255) DEFAULT NULL,
	`tel` varchar(11) DEFAULT NULL,
	`createtime` varchar(20) DEFAULT NULL,
	`modifiedtime` varchar(20) DEFAULT NULL,
	PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;