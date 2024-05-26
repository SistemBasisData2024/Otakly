DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS question CASCADE;
DROP TABLE IF EXISTS answer CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS comment CASCADE;
DROP TABLE IF EXISTS subject CASCADE;
DROP TABLE IF EXISTS rank CASCADE;
DROP TABLE IF EXISTS commentLike_user CASCADE;
DROP TABLE IF EXISTS vote_user CASCADE;

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
    subject_id VARCHAR(36),
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
    user_id VARCHAR(36) NOT NULL,
    upvote INT DEFAULT 0,
    downvote INT DEFAULT 0,
    text VARCHAR,
    image VARCHAR,
    written_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_answer_question FOREIGN KEY (question_id) REFERENCES question (id)
);


CREATE TABLE comment (
    id VARCHAR(36) PRIMARY KEY DEFAULT (gen_random_uuid()::text),
    answer_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    text TEXT,
    likes INT DEFAULT 0,
    written_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_comment_answer FOREIGN KEY (answer_id) REFERENCES answer (id),
    CONSTRAINT fk_comment_user FOREIGN KEY (user_id) REFERENCES users (user_id)
);


CREATE TABLE rank (
    id VARCHAR(36) PRIMARY KEY DEFAULT (gen_random_uuid()::text),
    user_id VARCHAR(36) NOT NULL,
    subject_id VARCHAR(36) NOT NULL,
    votes INT DEFAULT 0,
    CONSTRAINT fk_rank_user FOREIGN KEY (user_id) REFERENCES users (user_id),
    CONSTRAINT fk_rank_subject FOREIGN KEY (subject_id) REFERENCES subject (id)
);

CREATE TABLE commentLike_user (
    CONSTRAINT pk_commentLike_user PRIMARY KEY (comment_id, user_id),
    comment_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    CONSTRAINT fk_commentLike_user_comment FOREIGN KEY (comment_id) REFERENCES comment (id),
    CONSTRAINT fk_commentLike_user_user FOREIGN KEY (user_id) REFERENCES users (user_id)
);

CREATE TABLE vote_user (
    answer_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    upvote BOOLEAN,
    downvote BOOLEAN,
    CONSTRAINT fk_vote_user_answer FOREIGN KEY (answer_id) REFERENCES answer (id),
    CONSTRAINT fk_vote_user_user FOREIGN KEY (user_id) REFERENCES users (user_id),
    CONSTRAINT chk_vote_user CHECK ((upvote IS TRUE AND downvote IS FALSE) OR (upvote IS FALSE AND downvote IS TRUE))
);


-- Insert data into users table
INSERT INTO users (username, password, email, profile_picture) VALUES
('user1', 'password1', 'user1@example.com', 'profile1.jpg'),
('user2', 'password2', 'user2@example.com', 'profile2.jpg');

-- Insert data into subject table
INSERT INTO subject (name) VALUES
('Mathematics'),
('Science');

-- Insert data into question table
INSERT INTO question (user_id, subject_id, image, text) VALUES
((SELECT user_id FROM users WHERE username = 'user1'), (SELECT id FROM subject WHERE name = 'Mathematics'), 'question1.jpg', 'What is 2 + 2?'),
((SELECT user_id FROM users WHERE username = 'user2'), (SELECT id FROM subject WHERE name = 'Science'), 'question2.jpg', 'What is photosynthesis?');

-- Insert data into answer table
INSERT INTO answer (question_id, user_id, upvote, downvote, text, image) VALUES
((SELECT id FROM question WHERE text = 'What is 2 + 2?'), (SELECT user_id FROM users WHERE username = 'user2'), 10, 2, 'The answer is 4.', 'answer1.jpg'),
((SELECT id FROM question WHERE text = 'What is photosynthesis?'), (SELECT user_id FROM users WHERE username = 'user1'), 5, 1, 'Photosynthesis is the process by which green plants use sunlight to synthesize foods.', 'answer2.jpg');

-- Insert data into comment table
INSERT INTO comment (answer_id, user_id, text, likes) VALUES
((SELECT id FROM answer WHERE text = 'The answer is 4.'), (SELECT user_id FROM users WHERE username = 'user1'), 'Great answer!', 3),
((SELECT id FROM answer WHERE text = 'Photosynthesis is the process by which green plants use sunlight to synthesize foods.'), (SELECT user_id FROM users WHERE username = 'user2'), 'Very informative.', 2);

-- Insert data into rank table
INSERT INTO rank (user_id, subject_id, votes) VALUES
((SELECT user_id FROM users WHERE username = 'user1'), (SELECT id FROM subject WHERE name = 'Mathematics'), 10),
((SELECT user_id FROM users WHERE username = 'user2'), (SELECT id FROM subject WHERE name = 'Science'), 5);

-- Insert data into commentLike_user table
INSERT INTO commentLike_user (comment_id, user_id) VALUES
((SELECT id FROM comment WHERE text = 'Great answer!'), (SELECT user_id FROM users WHERE username = 'user2')),
((SELECT id FROM comment WHERE text = 'Very informative.'), (SELECT user_id FROM users WHERE username = 'user1'));

-- Insert data into vote_user table
INSERT INTO vote_user (answer_id, user_id, upvote, downvote) VALUES
((SELECT id FROM answer WHERE text = 'The answer is 4.'), (SELECT user_id FROM users WHERE username = 'user1'), TRUE, FALSE),
((SELECT id FROM answer WHERE text = 'Photosynthesis is the process by which green plants use sunlight to synthesize foods.'), (SELECT user_id FROM users WHERE username = 'user2'), TRUE, FALSE);
