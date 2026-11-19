CREATE TABLE vault_entries (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(100) NOT NULL,
    url VARCHAR(2048) DEFAULT NULL,
    username VARCHAR(255) DEFAULT NULL,
    password_encrypted BLOB NOT NULL,
    is_favorite BOOLEAN NOT NULL DEFAULT FALSE,

    CONSTRAINT fk_vault_entries_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;