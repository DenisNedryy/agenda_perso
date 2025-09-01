CREATE TABLE spacedRepetitionCard (
    id VARCHAR(36) PRIMARY KEY,
    task_id VARCHAR(36) NOT NULL,
    review_date DATE,
    step TINYINT UNSIGNED NOT NULL CHECK (step BETWEEN 1 AND 8),
    UNIQUE (task_id, step),
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
) ENGINE=InnoDB;