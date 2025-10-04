CREATE TABLE vocabulary (
    uuid VARCHAR(36) PRIMARY KEY,
    index_id INT AUTO_INCREMENT UNIQUE KEY ,
    user_id VARCHAR(36),
    fr_name VARCHAR(200) NOT NULL,
    uk_name VARCHAR(200) NOT NULL,
    category VARCHAR(200) NOT NULL,
    family VARCHAR(200) NOT NULL,
    img_url VARCHAR(500) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB; 
