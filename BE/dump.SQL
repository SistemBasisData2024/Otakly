DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS question CASCADE;
DROP TABLE IF EXISTS answer CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS subject CASCADE;
DROP TABLE IF EXISTS rank CASCADE;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    user_id VARCHAR(36) PRIMARY KEY DEFAULT (gen_random_uuid()::text),
    username VARCHAR UNIQUE NOT NULL,
    password VARCHAR NOT NULL,
    email VARCHAR NOT NULL,
    profile_picture VARCHAR
);


CREATE TABLE question (
    id VARCHAR(36) PRIMARY KEY DEFAULT (gen_random_uuid()::text),
    user_id VARCHAR(36) NOT NULL,
    image VARCHAR,
    text TEXT,
    written_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_question_user FOREIGN KEY (user_id) REFERENCES users (user_id)
);

CREATE TABLE subject (
    id VARCHAR(36) PRIMARY KEY DEFAULT (gen_random_uuid()::text),
    name VARCHAR NOT NULL UNIQUE
);


CREATE TABLE answer (
    id VARCHAR(36) PRIMARY KEY DEFAULT (gen_random_uuid()::text),
    question_id VARCHAR(36) NOT NULL,
    subject_id VARCHAR(36) NOT NULL,
    upvote INT DEFAULT 0,
    downvote INT DEFAULT 0,
    text VARCHAR,
    image VARCHAR,
    written_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_answer_question FOREIGN KEY (question_id) REFERENCES question (id),
    CONSTRAINT fk_answer_subject FOREIGN KEY (subject_id) REFERENCES subject (id)
);


CREATE TABLE comments (
    id VARCHAR(36) PRIMARY KEY DEFAULT (gen_random_uuid()::text),
    answer_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    text TEXT,
    likes INT DEFAULT 0,
    written_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_comments_answer FOREIGN KEY (answer_id) REFERENCES answer (id),
    CONSTRAINT fk_comments_user FOREIGN KEY (user_id) REFERENCES users (user_id)
);


CREATE TABLE rank (
    id VARCHAR(36) PRIMARY KEY DEFAULT (gen_random_uuid()::text),
    user_id VARCHAR(36) NOT NULL,
    subject_id VARCHAR(36) NOT NULL,
    upvote INT DEFAULT 0,
    downvote INT DEFAULT 0,
    CONSTRAINT fk_rank_user FOREIGN KEY (user_id) REFERENCES users (user_id),
    CONSTRAINT fk_rank_subject FOREIGN KEY (subject_id) REFERENCES subject (id)
);


-- Insert users
INSERT INTO users (username, password, email, profile_picture) VALUES
('john_doe', 'hashed_password123', 'john@example.com', 'https://example.com/profiles/john.jpg'),
('jane_doe', 'hashed_password456', 'jane@example.com', 'https://example.com/profiles/jane.jpg');

-- Insert subjects
INSERT INTO subject (name) VALUES
('Mathematics'),
('Physics');

-- Insert questions using user UUIDs retrieved from users table
INSERT INTO question (user_id, image, text) VALUES
((SELECT user_id FROM users WHERE username = 'john_doe'), 'https://example.com/questions/image1.jpg', 'How do you solve this equation?'),
((SELECT user_id FROM users WHERE username = 'jane_doe'), 'https://example.com/questions/image2.jpg', 'What is the principle behind this physics concept?');

-- Insert answers
INSERT INTO answer (question_id, subject_id, text, upvote, downvote, image) VALUES
((SELECT id FROM question WHERE text = 'How do you solve this equation?'), (SELECT id FROM subject WHERE name = 'Mathematics'), 'You solve it by isolating the variable.', 10, 2, 'https://example.com/answers/image1.jpg'),
((SELECT id FROM question WHERE text = 'What is the principle behind this physics concept?'), (SELECT id FROM subject WHERE name = 'Physics'), 'It is based on the laws of thermodynamics.', 15, 3, 'https://example.com/answers/image2.jpg');


-- Insert comments
INSERT INTO comments (answer_id, user_id, text, likes) VALUES
((SELECT id FROM answer WHERE text = 'You solve it by isolating the variable.'), (SELECT user_id FROM users WHERE username = 'john_doe'), 'This is a great explanation, thanks!', 5),
((SELECT id FROM answer WHERE text = 'It is based on the laws of thermodynamics.'), (SELECT user_id FROM users WHERE username = 'jane_doe'), 'Could you elaborate on the second law part?', 3);

-- Insert ranks
INSERT INTO rank (user_id, subject_id, upvote, downvote) VALUES
((SELECT user_id FROM users WHERE username = 'john_doe'), (SELECT id FROM subject WHERE name = 'Mathematics'), 120, 30),
((SELECT user_id FROM users WHERE username = 'jane_doe'), (SELECT id FROM subject WHERE name = 'Physics'), 100, 25);






