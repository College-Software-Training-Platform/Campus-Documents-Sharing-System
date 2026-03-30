CREATE DATABASE IF NOT EXISTS campus_sharing_system DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE campus_sharing_system;

-- 用户表 (USER)
CREATE TABLE IF NOT EXISTS `users` (
  `User_ID` INT AUTO_INCREMENT PRIMARY KEY,
  `Account` VARCHAR(50) NOT NULL UNIQUE,
  `Password` VARCHAR(255) NOT NULL,
  `Name` VARCHAR(100) NOT NULL,
  `Role` ENUM('admin', 'user') DEFAULT 'user',
  `Points_Balance` INT DEFAULT 0,
  `Contact` VARCHAR(100),
  `Account_Status` ENUM('active', 'banned') DEFAULT 'active',
  `Register_Time` DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 课程表 (COURSE)
CREATE TABLE IF NOT EXISTS `courses` (
  `Course_ID` INT AUTO_INCREMENT PRIMARY KEY,
  `Course_Name` VARCHAR(200) NOT NULL,
  `College` VARCHAR(100) NOT NULL
);

-- 标签表 (TAG)
CREATE TABLE IF NOT EXISTS `tags` (
  `Tag_ID` INT AUTO_INCREMENT PRIMARY KEY,
  `Tag_Name` VARCHAR(100) NOT NULL UNIQUE
);

-- 资料表 (RESOURCE)
CREATE TABLE IF NOT EXISTS `resources` (
  `Resource_ID` INT AUTO_INCREMENT PRIMARY KEY,
  `Title` VARCHAR(200) NOT NULL,
  `Uploader_ID` INT NOT NULL,
  `Course_ID` INT,
  `File_Path` VARCHAR(255) NOT NULL,
  `Format` VARCHAR(50),
  `File_Size` INT,
  `Extracted_Text` TEXT,
  `AI_Summary` TEXT,
  `Required_Points` INT DEFAULT 0,
  `Audit_Status` ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  `Upload_Time` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`Uploader_ID`) REFERENCES `users`(`User_ID`),
  FOREIGN KEY (`Course_ID`) REFERENCES `courses`(`Course_ID`)
);

-- 资料标签关联表 (RESOURCE_TAG_MAP)
CREATE TABLE IF NOT EXISTS `resource_tag_map` (
  `Resource_ID` INT NOT NULL,
  `Tag_ID` INT NOT NULL,
  PRIMARY KEY (`Resource_ID`, `Tag_ID`),
  FOREIGN KEY (`Resource_ID`) REFERENCES `resources`(`Resource_ID`) ON DELETE CASCADE,
  FOREIGN KEY (`Tag_ID`) REFERENCES `tags`(`Tag_ID`) ON DELETE CASCADE
);

-- 积分日志表 (POINTS_LOG)
CREATE TABLE IF NOT EXISTS `points_logs` (
  `Log_ID` INT AUTO_INCREMENT PRIMARY KEY,
  `User_ID` INT NOT NULL,
  `Amount` INT NOT NULL,
  `Reason` VARCHAR(255),
  `Ref_ID` INT, -- 可以是关联的资源ID等
  `Create_Time` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`User_ID`) REFERENCES `users`(`User_ID`)
);

-- 反馈表 (FEEDBACK)
CREATE TABLE IF NOT EXISTS `feedbacks` (
  `Feedback_ID` INT AUTO_INCREMENT PRIMARY KEY,
  `User_ID` INT NOT NULL,
  `Content` TEXT NOT NULL,
  `Status` ENUM('pending', 'processed') DEFAULT 'pending',
  `Admin_ID` INT,
  `Reply_Content` TEXT,
  `Submit_Time` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`User_ID`) REFERENCES `users`(`User_ID`),
  FOREIGN KEY (`Admin_ID`) REFERENCES `users`(`User_ID`)
);

-- 系统日志表 (SYSTEM_LOG)
CREATE TABLE IF NOT EXISTS `system_logs` (
  `SysLog_ID` INT AUTO_INCREMENT PRIMARY KEY,
  `Operator_ID` INT NOT NULL,
  `Action_Type` VARCHAR(100) NOT NULL,
  `Details` TEXT,
  `Action_Time` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`Operator_ID`) REFERENCES `users`(`User_ID`)
);

-- 下载记录表 (DOWNLOAD_RECORD)
CREATE TABLE IF NOT EXISTS `download_records` (
  `Download_ID` INT AUTO_INCREMENT PRIMARY KEY,
  `User_ID` INT NOT NULL,
  `Resource_ID` INT NOT NULL,
  `Deducted_Points` INT DEFAULT 0,
  `Download_Time` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `IP_Address` VARCHAR(50),
  FOREIGN KEY (`User_ID`) REFERENCES `users`(`User_ID`),
  FOREIGN KEY (`Resource_ID`) REFERENCES `resources`(`Resource_ID`)
);
