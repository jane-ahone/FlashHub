CREATE DATABASE IF NOT EXISTS 'flashhub';
USE 'flashhub';

CREATE TABLE IF NOT EXISTS 'schools' (
    'id' INT AUTO_INCREMENT PRIMARY KEY,
    'name' VARCHAR(255) NOT NULL,
    'location' VARCHAR(255) NOT NULL,
    'created_at' TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS 'courses' (
    'id' INT AUTO_INCREMENT PRIMARY KEY,
    'prefixed_id' VARCHAR(255),
    'name' VARCHAR(255) NOT NULL,
    'school_id' INT NOT NULL,
    'created_at' TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ('school_id') REFERENCES 'schools'('id')
);

DELIMITER $$
CREATE TRIGGER `courses_BEFORE_INSERT` BEFORE INSERT ON `courses` FOR EACH ROW
BEGIN
    SET NEW.prefixed_id = CONCAT('Course_', NEW.id);
END$$
DELIMITER ;

CREATE TABLE IF NOT EXISTS 'users' (
    'id' INT AUTO_INCREMENT PRIMARY KEY,
    'prefixed_id' VARCHAR(255),
    'first_name' VARCHAR(255) NOT NULL,
    'last_name' VARCHAR(255) NOT NULL,
    'email' VARCHAR(255) NOT NULL,
    'school_id' INT NOT NULL,
    'created_at' TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    'username' VARCHAR(255) NOT NULL,
    'type' ENUM('student', 'teacher') NOT NULL DEFAULT 'student',
    'profile_picture' VARCHAR(255) NOT NULL,
    FOREIGN KEY ('school_id') REFERENCES 'schools'('id')
);

DELIMITER $$
CREATE TRIGGER `users_BEFORE_INSERT` BEFORE INSERT ON `users` FOR EACH ROW
BEGIN
    SET NEW.prefixed_id = CONCAT('User_', NEW.id);
END$$
DELIMITER ;

CREATE TABLE IF NOT EXISTS 'courses_users' (
    'id' INT AUTO_INCREMENT PRIMARY KEY,
    'course_id' INT NOT NULL,
    'user_id' INT NOT NULL,
    'created_at' TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ('course_id') REFERENCES 'courses'('id'),
    FOREIGN KEY ('user_id') REFERENCES 'users'('id')
);

CREATE TABLE IF NOT EXISTS 'files' (
    'id' INT AUTO_INCREMENT PRIMARY KEY,
    'prefixed_id' VARCHAR(255),
    'name' VARCHAR(255) NOT NULL,
    'parent_directory' VARCHAR(255) NOT NULL,
    'type' ENUM('file', 'directory') NOT NULL DEFAULT 'file',
    'data_url' VARCHAR(255),
    'last_modified' TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    'file_type' ENUM('pdf', 'flashcard', 'docx', 'pptx', 'xlsx', 'video', 'audio', 'image', 'other') NOT NULL DEFAULT 'other',
    'created_at' TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    'user_id' INT NOT NULL,
    FOREIGN KEY ('user_id') REFERENCES 'users'('id')
);

DELIMITER $$
CREATE TRIGGER `files_BEFORE_INSERT` BEFORE INSERT ON `files` FOR EACH ROW
BEGIN
    CASE
        WHEN NEW.type = 'directory' THEN
            SET NEW.data_url = NULL;
            SET NEW.prefixed_id = CONCAT('Dir_', NEW.id);
        WHEN NEW.type = 'file' THEN
            SET NEW.prefixed_id  = CONCAT('File_', NEW.id);
    END CASE;

    CASE
        WHEN NEW.parent_directory = NEW.prefixed_id THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Parent directory cannot be the same as the file';
    END CASE;

    IF NOT EXISTS (
        SELECT * FROM files WHERE prefixed_id = NEW.parent_directory
            UNION
        SELECT * FROM courses WHERE prefixed_id = NEW.parent_directory
            UNION
        SELECT * FROM users WHERE prefixed_id = NEW.parent_directory
        ) THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Parent directory does not exist';
    END IF;
END$$
DELIMITER ;

CREATE TABLE IF NOT EXISTS 'friends' (
    'id' INT AUTO_INCREMENT PRIMARY KEY,
    'requester_id' INT NOT NULL,
    'friend_id' INT NOT NULL,
    'status' ENUM('pending', 'accepted', 'rejected') NOT NULL DEFAULT 'pending',
    'created_at' TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ('requester_id') REFERENCES 'users'('id'),
    FOREIGN KEY ('friend_id') REFERENCES 'users'('id')
);

CREATE TABLE IF NOT EXISTS 'messages' (
    'id' INT AUTO_INCREMENT PRIMARY KEY,
    'author_id' INT NOT NULL,
    'message' TEXT NOT NULL,
    'created_at' TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ('author_id') REFERENCES 'users'('id')
);

CREATE TABLE IF NOT EXISTS 'private_messages' (
    'id' INT AUTO_INCREMENT PRIMARY KEY,
    'sender_id' INT NOT NULL,
    'receiver_id' INT NOT NULL,
    'message_id' INT NOT NULL,
    'status' ENUM('pending', 'read', 'delivered') NOT NULL DEFAULT 'pending',
    'reply_to' INT,
    'created_at' TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ('sender_id') REFERENCES 'users'('id'),
    FOREIGN KEY ('receiver_id') REFERENCES 'users'('id'),
    FOREIGN KEY ('message_id') REFERENCES 'messages'('id'),
    FOREIGN KEY ('reply_to') REFERENCES 'private_messages'('id')
);

DELIMITER $$
CREATE TRIGGER `private_messages_BEFORE_INSERT` BEFORE INSERT ON `private_messages` FOR EACH ROW
BEGIN
    IF NEW.reply_to IS NOT NULL THEN
        IF NOT EXISTS (SELECT * FROM private_messages WHERE id = NEW.reply_to) THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Private message does not exist';
        END IF;
    END IF;
    
    IF New.replyto = NEW.id THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Private message cannot reply to itself';
    END IF;
END$$
DELIMITER ;

CREATE TABLE IF NOT EXISTS 'posts' (
    'id' INT AUTO_INCREMENT PRIMARY KEY,
    'user_id' INT NOT NULL,
    'message_id' INT NOT NULL,
    'reply_to' INT,
    'created_at' TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ('user_id') REFERENCES 'users'('id'),
    FOREIGN KEY ('reply_to') REFERENCES 'posts'('id'),
    FOREIGN KEY ('message_id') REFERENCES 'messages'('id')
);

DELIMITER $$
CREATE TRIGGER `posts_BEFORE_INSERT` BEFORE INSERT ON `posts` FOR EACH ROW
BEGIN
    IF NEW.reply_to IS NOT NULL THEN
        IF NOT EXISTS (SELECT * FROM posts WHERE id = NEW.reply_to) THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Post does not exist';
        END IF;
    END IF;
    
    IF New.replyto = NEW.id THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Post cannot reply to itself';
    END IF;
END$$
DELIMITER ;

CREATE TABLE IF NOT EXISTS 'attachments' (
    'id' INT AUTO_INCREMENT PRIMARY KEY,
    'message_id' INT NOT NULL,
    'file_url' VARCHAR(255) NOT NULL,
    'file_type' ENUM('image', 'video', 'audio', 'document') NOT NULL,
    'created_at' TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ('message_id') REFERENCES 'messages'('id')
);