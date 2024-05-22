const Question = require("../models/questionSchema.js");
const neonPool = require("../connect/connect.neon.js");

exports.getNewestQuestions = async (req, res) => {
  try {
    const query = `SELECT * FROM question ORDER BY written_at DESC LIMIT 10`;
    const { rows: questions } = await neonPool.query(query);

    for (let i = 0; i < questions.length; i++) {
      const query = `SELECT username, profile_picture FROM users WHERE user_id = $1`;
      const { rows: user } = await neonPool.query(query, [questions[i].user_id]);
      questions[i].user = user[0];
    }
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


