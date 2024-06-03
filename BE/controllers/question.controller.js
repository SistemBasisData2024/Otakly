const Question = require("../models/questionSchema.js");
const neonPool = require("../connect/connect.neon.js");

exports.getNewestQuestions = async (req, res) => {
  try {
    const query = `SELECT * FROM question ORDER BY written_at DESC LIMIT 20`;
    const { rows: questions } = await neonPool.query(query);

    await Promise.all(
      questions.map(async (question) => {
        const query = `SELECT username, profile_picture FROM users WHERE user_id = $1`;
        const { rows: user } = await neonPool.query(query, [question.user_id]);
        question.user = user[0];
      })
    );
    res.status(200).json({
      message: "Questions retrieved successfully",
      payload: questions,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occurred", error });
  }
};

exports.getQuestionDetails = async (req, res) => {
  const { question_id } = req.params;
  try {
    const QuestionQuery = `SELECT * FROM question WHERE id = $1`;
    const { rows: question } = await neonPool.query(QuestionQuery, [
      question_id,
    ]);
    if (question.length === 0) {
      return res.status(404).json({ message: "Question not found" });
    }
    question[0].written_at = new Date(
      question[0].written_at.getTime() + 7 * 60 * 60 * 1000
    );
    const UserOfQuestionQuery = `SELECT username, profile_picture FROM users WHERE user_id = $1`;
    const { rows: user } = await neonPool.query(UserOfQuestionQuery, [
      question[0].user_id,
    ]);
    question[0].user = user[0];

    const AnswerOfQuestionQuery = `SELECT * FROM answer WHERE question_id = $1`;
    const { rows: answers } = await neonPool.query(AnswerOfQuestionQuery, [
      question_id,
    ]);
    answers.forEach((answer) => {
      answer.written_at = new Date(
        answer.written_at.getTime() + 7 * 60 * 60 * 1000
      );
    });
    question[0].answers = answers;

    await Promise.all(
      answers.map(async (answer) => {
        const UserOfAnswerQuery = `SELECT username, profile_picture FROM users WHERE user_id = $1`;
        const { rows: user } = await neonPool.query(UserOfAnswerQuery, [
          answer.user_id,
        ]);
        answer.user = user[0];
        const CommentOfAnswerQuery = `SELECT * FROM comment WHERE answer_id = $1 ORDER BY written_at DESC`;
        const { rows: comments } = await neonPool.query(CommentOfAnswerQuery, [
          answer.id,
        ]);
        await Promise.all(
          comments.map(async (comment) => {
            comment.written_at = new Date(
              comment.written_at.getTime() + 7 * 60 * 60 * 1000
            );
            const UserOfCommentQuery = `SELECT username, profile_picture FROM users WHERE user_id = $1`;
            const { rows: user } = await neonPool.query(UserOfCommentQuery, [
              comment.user_id,
            ]);
            comment.user = user[0];
          })
        );
        answer.comments = comments;
      })
    );
    question[0].answers = answers;
    res.status(200).json({
      message: "Question retrieved successfully",
      payload: question[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred", error });
  }
};

exports.getSearchQuestions = async (req, res) => {
  try {
    const { search } = req.query;
    console.log("Search parameter:", search);
    let query = `SELECT * FROM question`;
    const values = [];

    if (search) {
      query += ` WHERE text ILIKE $1`;
      values.push(`%${search}%`);
    }

    console.log("Query:", query);
    console.log("Values:", values);

    const { rows: questions } = await neonPool.query(query, values);
    console.log("Questions fetched:", questions);

    await Promise.all(
      questions.map(async (question) => {
        const userQuery = `SELECT username, profile_picture FROM users WHERE user_id = $1`;
        const { rows: user } = await neonPool.query(userQuery, [
          question.user_id,
        ]);
        question.user = user[0];
      })
    );

    res.json({
      message: "Questions retrieved successfully",
      payload: questions,
    });
  } catch (error) {
    console.error("Error fetching questions:", error);
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
};

exports.postQuestion = async (req, res) => {
  const { user_id, subject, text, image } = req.body;
  try {
    const query = `INSERT INTO question(user_id, subject, text, image) VALUES($1, $2, $3, $4) RETURNING *`;
    const { rows: question } = await neonPool.query(query, [
      user_id,
      subject,
      text,
      image,
    ]);
    res.status(201).json({
      message: "Question created successfully",
      payload: question[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occurred", error });
  }
};
