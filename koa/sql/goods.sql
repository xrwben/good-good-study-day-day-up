CREATE TABLE IF NOT EXISTS 'user' (
	'id' int(11) NOT NUll AUTO_INCREMENT,
	'name' varchar(255) DEFAULT NUll,
	'price' varchar(255) DEFAULT NULL,
	'createtime' varchar(20) DEFAULT NULL,
	'modifiedtime' varchar(20) DEFAULT NULL,
	PRIMARY KEY ('id')
)ENGINE=InnoDB DEFAULT CHARSET=utf8;