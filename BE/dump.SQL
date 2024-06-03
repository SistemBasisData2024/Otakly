-- Drop existing tables if they exist
DROP TABLE IF EXISTS commentlike_user CASCADE;
DROP TABLE IF EXISTS vote_user CASCADE;
DROP TABLE IF EXISTS comment CASCADE;
DROP TABLE IF EXISTS answer CASCADE;
DROP TABLE IF EXISTS question CASCADE;
DROP TABLE IF EXISTS rank CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create the required extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create ENUM type for subjects
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subject_enum') THEN
        CREATE TYPE subject_enum AS ENUM ('Math', 'Physics', 'Chemistry', 'Biology', 'Sociology', 'Economy', 'Geology');
    END IF;
END $$;

-- Create users table
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR UNIQUE NOT NULL,
    password VARCHAR NOT NULL,
    email VARCHAR NOT NULL,
    profile_picture VARCHAR
);

-- Create question table
CREATE TABLE question (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    subject subject_enum,
    image VARCHAR,
    text TEXT,
    written_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_question_user FOREIGN KEY (user_id) REFERENCES users (user_id)
);

-- Create answer table
CREATE TABLE answer (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_id UUID NOT NULL,
    user_id UUID NOT NULL,
    upvote INT DEFAULT 0,
    downvote INT DEFAULT 0,
    text TEXT,
    image VARCHAR,
    written_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_answer_question FOREIGN KEY (question_id) REFERENCES question (id),
    CONSTRAINT fk_answer_user FOREIGN KEY (user_id) REFERENCES users (user_id)
);

-- Create comment table
CREATE TABLE comment (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    answer_id UUID NOT NULL,
    user_id UUID NOT NULL,
    text TEXT,
    likes INT DEFAULT 0,
    written_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_comment_answer FOREIGN KEY (answer_id) REFERENCES answer (id),
    CONSTRAINT fk_comment_user FOREIGN KEY (user_id) REFERENCES users (user_id)
);

-- Create rank table
CREATE TABLE rank (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    subject subject_enum NOT NULL,
    votes INT DEFAULT 0,
    CONSTRAINT fk_rank_user FOREIGN KEY (user_id) REFERENCES users (user_id)
);

-- Create commentLike_user table
CREATE TABLE commentlike_user (
    comment_id UUID NOT NULL,
    user_id UUID NOT NULL,
    PRIMARY KEY (comment_id, user_id),
    CONSTRAINT fk_commentlike_user_comment FOREIGN KEY (comment_id) REFERENCES comment (id),
    CONSTRAINT fk_commentlike_user_user FOREIGN KEY (user_id) REFERENCES users (user_id)
);

-- Create vote_user table
CREATE TABLE vote_user (
    answer_id UUID NOT NULL,
    user_id UUID NOT NULL,
    upvote BOOLEAN,
    downvote BOOLEAN,
    PRIMARY KEY (answer_id, user_id),
    CONSTRAINT fk_vote_user_answer FOREIGN KEY (answer_id) REFERENCES answer (id),
    CONSTRAINT fk_vote_user_user FOREIGN KEY (user_id) REFERENCES users (user_id),
    CONSTRAINT chk_vote_user CHECK ((upvote IS TRUE AND downvote IS FALSE) OR (upvote IS FALSE AND downvote IS TRUE))
);

-- Insert data into users table
INSERT INTO users (username, password, email, profile_picture) VALUES
('user1', 'password1', 'user1@example.com', 'profile1.jpg'),
('user2', 'password2', 'user2@example.com', 'profile2.jpg');

-- Insert data into question table
INSERT INTO question (user_id, subject, text, image) VALUES
((SELECT user_id FROM users WHERE username = 'user1'), 'Math', 'What is 2 + 2?', 'question1.jpg'),
((SELECT user_id FROM users WHERE username = 'user2'), 'Biology', 'What is photosynthesis?', 'question2.jpg');

-- Insert data into answer table
INSERT INTO answer (question_id, user_id, upvote, downvote, text, image) VALUES
((SELECT id FROM question WHERE text = 'What is 2 + 2?'), (SELECT user_id FROM users WHERE username = 'user2'), 10, 2, 'The answer is 4.', 'answer1.jpg'),
((SELECT id FROM question WHERE text = 'What is photosynthesis?'), (SELECT user_id FROM users WHERE username = 'user1'), 5, 1, 'Photosynthesis is the process by which green plants use sunlight to synthesize foods.', 'answer2.jpg');

-- Insert data into comment table
INSERT INTO comment (answer_id, user_id, text, likes) VALUES
((SELECT id FROM answer WHERE text = 'The answer is 4.'), (SELECT user_id FROM users WHERE username = 'user1'), 'Great answer!', 3),
((SELECT id FROM answer WHERE text = 'Photosynthesis is the process by which green plants use sunlight to synthesize foods.'), (SELECT user_id FROM users WHERE username = 'user2'), 'Very informative.', 2);

-- Insert data into rank table
INSERT INTO rank (user_id, subject, votes) VALUES
((SELECT user_id FROM users WHERE username = 'user1'), 'Math', 10),
((SELECT user_id FROM users WHERE username = 'user2'), 'Biology', 5);

-- Insert data into commentlike_user table
INSERT INTO commentlike_user (comment_id, user_id) VALUES
((SELECT id FROM comment WHERE text = 'Great answer!'), (SELECT user_id FROM users WHERE username = 'user2')),
((SELECT id FROM comment WHERE text = 'Very informative.'), (SELECT user_id FROM users WHERE username = 'user1'));

-- Insert data into vote_user table
INSERT INTO vote_user (answer_id, user_id, upvote, downvote) VALUES
((SELECT id FROM answer WHERE text = 'The answer is 4.'), (SELECT user_id FROM users WHERE username = 'user1'), TRUE, FALSE),
((SELECT id FROM answer WHERE text = 'Photosynthesis is the process by which green plants use sunlight to synthesize foods.'), (SELECT user_id FROM users WHERE username = 'user2'), TRUE, FALSE);

-- Create trigger and function to update rank votes
CREATE OR REPLACE FUNCTION update_rank_votes()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE rank
    SET votes = (SELECT SUM(a.upvote - a.downvote)
                 FROM answer a
                 WHERE a.user_id = NEW.user_id AND a.question_id = NEW.question_id)
    WHERE rank.user_id = NEW.user_id AND rank.subject = (SELECT subject FROM question WHERE id = NEW.question_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_votes
AFTER INSERT OR UPDATE OF upvote, downvote ON answer
FOR EACH ROW
EXECUTE FUNCTION update_rank_votes();
