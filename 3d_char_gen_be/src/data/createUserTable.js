import pool from "../config/db.js";

const createUserTable = async () => {
	const queryText = `
	CREATE TABLE IF NOT EXISTS users (
	id SERIAL PRIMARY KEY,
	role VARCHAR(50) DEFAULT 'user',
	name VARCHAR(100) NOT NULL,
	username VARCHAR(100) NOT NULL,
	email VARCHAR(100) UNIQUE NOT NULL,
	password VARCHAR(255) NOT NULL,
	bio TEXT,
  birthday DATE,
	created_at TIMESTAMP DEFAULT NOW()
	)`;

	try {
		pool.query(queryText);
		console.log("User table created if not exists");
	} catch (error) {
		console.log("Erorr creating table: ", error);
	}
};

export default createUserTable;