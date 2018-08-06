/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 80011
Source Host           : localhost:3306
Source Database       : frontend

Target Server Type    : MYSQL
Target Server Version : 80011
File Encoding         : 65001

Date: 2018-08-05 13:45:41
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for sudoku
-- ----------------------------
DROP TABLE IF EXISTS `sudoku`;
CREATE TABLE `sudoku` (
  `result` varchar(81) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `tries` int(11) DEFAULT NULL,
  PRIMARY KEY (`result`),
  UNIQUE KEY `unique` (`result`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
