const User = require("../models/userSchema");
const neonPool = require("../connect/connect.neon");
const bcrypt = require("bcrypt");

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const query = `SELECT * FROM users WHERE username = $1`;
    const {rows: user}= await neonPool.query(query, [username]);

    if (!user.length) {
      return res.status(400).json({ message: "Invalid username or password"});
    }
    if(!await bcrypt.compare(password, user[0].password)){
      return res.status(400).json({ message: "Invalid username or password" });
    }
    const userData = user[0];
    const payload = new User(userData.user_id, userData.username, userData.password, userData.email, userData.profile_picture);
    res.status(200).json({ message: "Login successful", payload: payload });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occurred", error });
  }
};


exports.register = async (req, res) => {
  const { username, password, email } = req.body;
  try {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Email must be in a valid format (e.g. example@example.com)" });
    }
    if (!usernameRegex.test(username)) {
      return res.status(400).json({ message: "Username must be alphanumeric and between 3 and 20 characters long" });
    }
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ message: "Password must contain at least 8 characters, including at least one uppercase letter, one lowercase letter, and one digit" });
    }
    const checkExistingUser = `SELECT * FROM users WHERE username = $1 OR email = $2`;
    const existingUser = await neonPool.query(checkExistingUser, [username, email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "Username or email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 12);

    const query = `INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING *`;
    const { rows: user } = await neonPool.query(query, [username, hashedPassword, email]);
    const userData = user[0];
    const payload = new User(userData.user_id, userData.username, userData.password, userData.email);
    res.status(201).json({ message: "User created successfully", payload: payload });
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
  }
}

exports.deleteUser = async (req, res) => {
  const { user_id } = req.params;
  try {
    const query = `DELETE FROM users WHERE user_id = $1 RETURNING *`;
    const { rows: user } = await neonPool.query(query, [user_id]);
    if (!user.length) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully", payload: user[0] });
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
  }
}

exports.updateUser = async (req, res) => {
  const { user_id } = req.params;
  const { username, password, email, profile_picture } = req.body;

  try {
    // Check if the username or email already exists for another user
    const checkExisting = `SELECT * FROM users WHERE (username = $1 OR email = $2) AND user_id != $3`;
    const existingUsers = await neonPool.query(checkExisting, [username, email, user_id]);
    if (existingUsers.rows.length > 0) {
      const takenFields = [];
      existingUsers.rows.forEach(row => {
        if (row.username === username) takenFields.push("username");
        if (row.email === email) takenFields.push("email");
      });
      return res.status(400).json({ message: `The following fields are already taken: ${takenFields.join(", ")}` });
    }

    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update the user information
    const updateQuery = `UPDATE users SET username = $1, password = $2, email = $3, profile_picture = $4 WHERE user_id = $5 RETURNING *`;
    const updatedUser = await neonPool.query(updateQuery, [username, hashedPassword, email, profile_picture, user_id]);
    if (updatedUser.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const userData = updatedUser.rows[0];
    // Consider creating a safer payload that doesn’t include sensitive data
    const payload = { user_id: userData.user_id, username: userData.username, email: userData.email, profile_picture: userData.profile_picture };
    res.status(200).json({ message: "User updated successfully", payload });
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
  }
};
