/*
 Navicat Premium Dump SQL

 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 80408 (8.4.8)
 Source Host           : localhost:3306
 Source Schema         : campus_sharing_system

 Target Server Type    : MySQL
 Target Server Version : 80408 (8.4.8)
 File Encoding         : 65001

 Date: 02/04/2026 21:27:28
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for courses
-- ----------------------------
DROP TABLE IF EXISTS `courses`;
CREATE TABLE `courses`  (
  `course_ID` int NOT NULL AUTO_INCREMENT,
  `course_Name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `college` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`course_ID`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for download_records
-- ----------------------------
DROP TABLE IF EXISTS `download_records`;
CREATE TABLE `download_records`  (
  `download_ID` int NOT NULL AUTO_INCREMENT,
  `user_ID` int NOT NULL,
  `resource_ID` int NOT NULL,
  `deducted_Points` int NULL DEFAULT 0,
  `download_Time` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `ip_Address` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  PRIMARY KEY (`download_ID`) USING BTREE,
  INDEX `user_ID`(`user_ID` ASC) USING BTREE,
  INDEX `resource_ID`(`resource_ID` ASC) USING BTREE,
  CONSTRAINT `download_records_ibfk_1` FOREIGN KEY (`user_ID`) REFERENCES `users` (`user_ID`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `download_records_ibfk_2` FOREIGN KEY (`resource_ID`) REFERENCES `resources` (`resource_ID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for feedbacks
-- ----------------------------
DROP TABLE IF EXISTS `feedbacks`;
CREATE TABLE `feedbacks`  (
  `feedback_ID` int NOT NULL AUTO_INCREMENT,
  `user_ID` int NOT NULL,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('pending','processed') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT 'pending',
  `admin_ID` int NULL DEFAULT NULL,
  `reply_Content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `submit_Time` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`feedback_ID`) USING BTREE,
  INDEX `user_ID`(`user_ID` ASC) USING BTREE,
  INDEX `admin_ID`(`admin_ID` ASC) USING BTREE,
  CONSTRAINT `feedbacks_ibfk_1` FOREIGN KEY (`user_ID`) REFERENCES `users` (`user_ID`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `feedbacks_ibfk_2` FOREIGN KEY (`admin_ID`) REFERENCES `users` (`user_ID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for points_logs
-- ----------------------------
DROP TABLE IF EXISTS `points_logs`;
CREATE TABLE `points_logs`  (
  `log_ID` int NOT NULL AUTO_INCREMENT,
  `user_ID` int NOT NULL,
  `amount` int NOT NULL,
  `reason` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `ref_ID` int NULL DEFAULT NULL,
  `create_Time` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`log_ID`) USING BTREE,
  INDEX `user_ID`(`user_ID` ASC) USING BTREE,
  CONSTRAINT `points_logs_ibfk_1` FOREIGN KEY (`user_ID`) REFERENCES `users` (`user_ID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for resource_tag_map
-- ----------------------------
DROP TABLE IF EXISTS `resource_tag_map`;
CREATE TABLE `resource_tag_map`  (
  `resource_ID` int NOT NULL,
  `tag_ID` int NOT NULL,
  PRIMARY KEY (`resource_ID`, `tag_ID`) USING BTREE,
  INDEX `tag_ID`(`tag_ID` ASC) USING BTREE,
  CONSTRAINT `resource_tag_map_ibfk_1` FOREIGN KEY (`resource_ID`) REFERENCES `resources` (`resource_ID`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `resource_tag_map_ibfk_2` FOREIGN KEY (`tag_ID`) REFERENCES `tags` (`tag_ID`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for resources
-- ----------------------------
DROP TABLE IF EXISTS `resources`;
CREATE TABLE `resources`  (
  `resource_ID` int NOT NULL AUTO_INCREMENT,
  `title` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `uploader_ID` int NOT NULL,
  `course_ID` int NULL DEFAULT NULL,
  `file_Path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `format` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `file_Size` int NULL DEFAULT NULL,
  `extracted_Text` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `ai_Summary` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `required_Points` int NULL DEFAULT 5,
  `audit_Status` enum('pending','approved','rejected') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT 'pending',
  `upload_Time` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `download_Count` int NULL DEFAULT 0,
  PRIMARY KEY (`resource_ID`) USING BTREE,
  INDEX `uploader_ID`(`uploader_ID` ASC) USING BTREE,
  INDEX `course_ID`(`course_ID` ASC) USING BTREE,
  CONSTRAINT `resources_ibfk_1` FOREIGN KEY (`uploader_ID`) REFERENCES `users` (`user_ID`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `resources_ibfk_2` FOREIGN KEY (`course_ID`) REFERENCES `courses` (`course_ID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for system_logs
-- ----------------------------
DROP TABLE IF EXISTS `system_logs`;
CREATE TABLE `system_logs`  (
  `sysLog_ID` int NOT NULL AUTO_INCREMENT,
  `operator_ID` int NOT NULL,
  `action_Type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `details` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `action_Time` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`sysLog_ID`) USING BTREE,
  INDEX `operator_ID`(`operator_ID` ASC) USING BTREE,
  CONSTRAINT `system_logs_ibfk_1` FOREIGN KEY (`operator_ID`) REFERENCES `users` (`user_ID`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for tags
-- ----------------------------
DROP TABLE IF EXISTS `tags`;
CREATE TABLE `tags`  (
  `tag_ID` int NOT NULL AUTO_INCREMENT,
  `tag_Name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`tag_ID`) USING BTREE,
  UNIQUE INDEX `tag_Name`(`tag_Name` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `user_ID` int NOT NULL AUTO_INCREMENT,
  `account` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('admin','user') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT 'user',
  `points_Balance` int NULL DEFAULT 100,
  `contact` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `account_Status` enum('active','banned') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT 'active',
  `register_Time` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `bio` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `major` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `avatar_Url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  PRIMARY KEY (`user_ID`) USING BTREE,
  UNIQUE INDEX `account`(`account` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;
