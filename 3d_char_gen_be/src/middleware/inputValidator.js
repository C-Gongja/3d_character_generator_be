import pool from "../config/db.js";

// Assuming you have a function to check the database
const checkDisplayNameUnique = async (displayName) => {
	const result = await pool.query("SELECT * FROM users WHERE username = $1", [displayName]);
	return result.rows.length === 0; // true if available, false if taken
};

const validateUser = async (req, res, next) => {

	const checkUsername = await checkDisplayNameUnique(req.body.username);
	if (!checkUsername) return res.status(400).json({
		status: 400,
		message: "An acconunt with this username already exists.",
	});

	console.log("validate user successfully");
	next();
};

export default validateUser;