CREATE DATABASE IF NOT EXISTS shopishop;

USE shopishop;

CREATE TABLE IF NOT EXISTS persons(
    `id` bigint(20) NOT NULL AUTO_INCREMENT,
    `name` varchar(255) DEFAULT NULL,
    PRIMARY KEY (`id`)
    )ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT  INTO persons(name) VALUES('Amila');
INSERT  INTO persons(name) VALUES('Iroshan');