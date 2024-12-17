USE webtech_fall2024_rachel_yeboah;

CREATE TABLE IF NOT EXISTS otakuUsers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- A test user
INSERT INTO otakuUsers (username, password)
VALUES ('otaku', '$2y$10$zC5iSBZHzwj6hFseqLqMdetC2EqBy4iwHq4.hvFwfQ8qwxNSEOqNu');
