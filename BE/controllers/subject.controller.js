const neonPool = require("../connect/connect.neon.js");

exports.getSubjects = async (req, res) => {
    try {
        const query = `SELECT id, name FROM subject ORDER BY name ASC`;
        const { rows: subjects } = await neonPool.query(query);
        res.status(200).json({
            message: "Subjects retrieved successfully",
            payload: subjects,
        });
    } catch (error) {
        console.error('Error retrieving subjects:', error);
        res.status(500).json({ message: "An error occurred", error });
    }
};

