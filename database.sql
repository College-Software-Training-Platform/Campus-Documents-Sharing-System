CREATE DATABASE IF NOT EXISTS campus_sharing_system DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE campus_sharing_system;

-- 用户表 (USER)
CREATE TABLE IF NOT EXISTS `users` (
  `user_ID` INT AUTO_INCREMENT PRIMARY KEY,
  `account` VARCHAR(50) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `role` ENUM('admin', 'user') DEFAULT 'user',
  `points_Balance` INT DEFAULT 0,
  `contact` VARCHAR(100),
  `account_Status` ENUM('active', 'banned') DEFAULT 'active',
  `register_Time` DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 课程表 (COURSE)
CREATE TABLE IF NOT EXISTS `courses` (
  `course_ID` INT AUTO_INCREMENT PRIMARY KEY,
  `course_Name` VARCHAR(200) NOT NULL,
  `college` VARCHAR(100) NOT NULL
);

-- 标签表 (TAG)
CREATE TABLE IF NOT EXISTS `tags` (
  `tag_ID` INT AUTO_INCREMENT PRIMARY KEY,
  `tag_Name` VARCHAR(100) NOT NULL UNIQUE
);

-- 资料表 (RESOURCE)
CREATE TABLE IF NOT EXISTS `resources` (
  `resource_ID` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(200) NOT NULL,
  `uploader_ID` INT NOT NULL,
  `course_ID` INT,
  `file_Path` VARCHAR(255) NOT NULL,
  `format` VARCHAR(50),
  `file_Size` INT,
  `extracted_Text` TEXT,
  `ai_Summary` TEXT,
  `required_Points` INT DEFAULT 0,
  `audit_Status` ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  `upload_Time` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`uploader_ID`) REFERENCES `users`(`user_ID`),
  FOREIGN KEY (`course_ID`) REFERENCES `courses`(`course_ID`)
);

-- 资料标签关联表 (RESOURCE_TAG_MAP)
CREATE TABLE IF NOT EXISTS `resource_tag_map` (
  `resource_ID` INT NOT NULL,
  `tag_ID` INT NOT NULL,
  PRIMARY KEY (`resource_ID`, `tag_ID`),
  FOREIGN KEY (`resource_ID`) REFERENCES `resources`(`resource_ID`) ON DELETE CASCADE,
  FOREIGN KEY (`tag_ID`) REFERENCES `tags`(`tag_ID`) ON DELETE CASCADE
);

-- 积分日志表 (POINTS_LOG)
CREATE TABLE IF NOT EXISTS `points_logs` (
  `log_ID` INT AUTO_INCREMENT PRIMARY KEY,
  `user_ID` INT NOT NULL,
  `amount` INT NOT NULL,
  `reason` VARCHAR(255),
  `ref_ID` INT, -- 可以是关联的资源ID等
  `create_Time` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_ID`) REFERENCES `users`(`user_ID`)
);

-- 反馈表 (FEEDBACK)
CREATE TABLE IF NOT EXISTS `feedbacks` (
  `feedback_ID` INT AUTO_INCREMENT PRIMARY KEY,
  `user_ID` INT NOT NULL,
  `content` TEXT NOT NULL,
  `status` ENUM('pending', 'processed') DEFAULT 'pending',
  `admin_ID` INT,
  `reply_Content` TEXT,
  `submit_Time` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_ID`) REFERENCES `users`(`user_ID`),
  FOREIGN KEY (`admin_ID`) REFERENCES `users`(`user_ID`)
);

-- 系统日志表 (SYSTEM_LOG)
CREATE TABLE IF NOT EXISTS `system_logs` (
  `sysLog_ID` INT AUTO_INCREMENT PRIMARY KEY,
  `operator_ID` INT NOT NULL,
  `action_Type` VARCHAR(100) NOT NULL,
  `details` TEXT,
  `action_Time` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`operator_ID`) REFERENCES `users`(`user_ID`)
);

-- 下载记录表 (DOWNLOAD_RECORD)
CREATE TABLE IF NOT EXISTS `download_records` (
  `download_ID` INT AUTO_INCREMENT PRIMARY KEY,
  `user_ID` INT NOT NULL,
  `resource_ID` INT NOT NULL,
  `deducted_Points` INT DEFAULT 0,
  `download_Time` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `ip_Address` VARCHAR(50),
  FOREIGN KEY (`user_ID`) REFERENCES `users`(`user_ID`),
  FOREIGN KEY (`resource_ID`) REFERENCES `resources`(`resource_ID`)
);
