import pool from "../config/db.js";
import bcrypt from "bcrypt";

export const getAllUsersService = async () => {
	const result = await pool.query("SELECT * FROM users");
	return result.rows;
};

export const getUserByIdService = async (id) => {
	const result = await pool.query("SELECT * FROM users where id = $1", [id]);
	return result.rows[0];
};

export const getUserByEmailService = async (email) => {
	const result = await pool.query("SELECT * FROM users where email = $1", [email]);
	return result.rows[0];
};

export const createUserService = async (body) => {
	const hashedPassword = await bcrypt.hash(body.password, 10);
	const result = await pool.query(
		'INSERT INTO users (name, username, email, password, birthday, created_at) VALUES ($1, $2, $3, $4, $5, $6)',
		[body.name, body.username, body.email, hashedPassword, body.birthday, new Date()]
	);
	console.log("user create successfully");
	return result.rows[0];
};

export const updateUserService = async (id, name, email) => {
	const result = await pool.query("UPDATE users SET name=$1, email=$2 WHERE id=$3 RETURNING *", [name, email, id]);
	return result.rows[0];
};

export const deleteUserService = async (id) => {
	const result = await pool.query("DELETE FROM users WHERE id=$1 RETURNING *", [id]);
	return result.rows[0];
};