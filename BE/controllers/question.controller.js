const Question = require("../models/questionSchema.js");
const neonPool = require("../connect/connect.neon.js");

exports.getNewestQuestions = async (req, res) => {
  try {
    const query = `SELECT * FROM question ORDER BY written_at DESC LIMIT 20`;
    const { rows: questions } = await neonPool.query(query);

    await Promise.all(questions.map(async (question) => {
      const query = `SELECT username, profile_picture FROM users WHERE user_id = $1`;
      const { rows: user } = await neonPool.query(query, [question.user_id]);
      question.user = user[0];
    }));
    res
      .status(200)
      .json({
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
    const QuestionQuery= `SELECT * FROM question WHERE id = $1`;
    const { rows: question } = await neonPool.query(QuestionQuery, [question_id]);
    if (question.length === 0) {
      return res.status(404).json({ message: "Question not found" });
    }
    question[0].written_at = new Date(question[0].written_at.getTime() + (7 * 60 * 60 * 1000));
    const UserOfQuestionQuery = `SELECT username, profile_picture FROM users WHERE user_id = $1`;
    const { rows: user } = await neonPool.query(UserOfQuestionQuery, [question[0].user_id]);
    question[0].user = user[0];

   const SubjectOfQuestionQuery = `SELECT * FROM subject WHERE id = $1`;
    const { rows: subject } = await neonPool.query(SubjectOfQuestionQuery, [question[0].subject_id]);
    if (subject.length > 0) {
      question[0].subject = subject[0];
    } else {
      question[0].subject = { name: "Subject not found" }; // Tangani kasus ketika subject tidak ditemukan
    }

    const AnswerOfQuestionQuery = `SELECT * FROM answer WHERE question_id = $1`;
    const { rows: answers } = await neonPool.query(AnswerOfQuestionQuery, [question_id]);
    answers.forEach(answer => {
      answer.written_at = new Date(answer.written_at.getTime() + (7 * 60 * 60 * 1000));
    });
    question[0].answers = answers;

    await Promise.all(answers.map(async (answer) => {
      const UserOfAnswerQuery = `SELECT username, profile_picture FROM users WHERE user_id = $1`;
      const { rows: user } = await neonPool.query(UserOfAnswerQuery, [answer.user_id]);
      answer.user = user[0];
      const CommentOfAnswerQuery = `SELECT * FROM comment WHERE answer_id = $1 ORDER BY written_at DESC`;
      const { rows: comments } = await neonPool.query(CommentOfAnswerQuery, [answer.id]);
      await Promise.all(comments.map(async (comment) => {
        comment.written_at = new Date(comment.written_at.getTime() + (7 * 60 * 60 * 1000));
        const UserOfCommentQuery = `SELECT username, profile_picture FROM users WHERE user_id = $1`;
        const { rows: user } = await neonPool.query(UserOfCommentQuery, [comment.user_id]);
        comment.user = user[0];
      }));
      answer.comments = comments;
    }));
    question[0].answers = answers;
    res.status(200).json({
      message: "Question retrieved successfully",
      payload: question[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred", error });
  }
}

exports.getSearchQuestions = async (req, res) => {
  try {
    const { search } = req.query;
    console.log('Search parameter:', search);
    let query = `SELECT * FROM question`;
    const values = [];

    if (search) {
      query += ` WHERE text ILIKE $1`;
      values.push(`%${search}%`);
    }

    console.log('Query:', query);
    console.log('Values:', values);

    const { rows: questions } = await neonPool.query(query, values);
    console.log('Questions fetched:', questions);

    await Promise.all(questions.map(async (question) => {
      const userQuery = `SELECT username, profile_picture FROM users WHERE user_id = $1`;
      const { rows: user } = await neonPool.query(userQuery, [question.user_id]);
      question.user = user[0];
    }));

    res.json({ message: "Questions retrieved successfully", payload: questions });
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ message: "An error occurred", error: error.message });
  }
};

exports.postQuestion = async (req, res) => {
  const { user_id, subject_id, text, image } = req.body;

  console.log("Received data:", { user_id, subject_id, image, text }); // Log received data

  if (!user_id) {
    return res.status(400).json({ message: "User ID is required" });
  }

  // Periksa apakah user_id ada di tabel users
  const userCheckQuery = `SELECT * FROM users WHERE user_id = $1`;
  const { rows: userRows } = await neonPool.query(userCheckQuery, [user_id]);

  if (userRows.length === 0) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    const subjectQuery = `INSERT INTO subject(name) VALUES($1) RETURNING *`;
    const { rows: subjectRows } = await neonPool.query(subjectQuery, [subject_id]);

    if (subjectRows.length === 0) {
        throw new Error("Failed to insert subject");
    }

    const subjectId = subjectRows[0].id;

    const questionQuery = `INSERT INTO question(user_id, subject_id, text, image, written_at) VALUES($1, $2, $3, $4, NOW()) RETURNING *`;
    const { rows: questionRows } = await neonPool.query(questionQuery, [user_id, subjectId, text, image]);

    console.log("Inserted question:", questionRows[0]); // Log inserted question data

    res.status(201).json({ message: "Pertanyaan berhasil diposting", payload: questionRows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan", error });
  }
};
