const Question = require("../models/questionSchema.js");
const neonPool = require("../connect/connect.neon");

exports.getNewestQuestions = async (req, res) => {
  try {
    const query = `SELECT * FROM question ORDER BY written_at DESC LIMIT 10`;
    const { rows: questions } = await neonPool.query(query);
    
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


