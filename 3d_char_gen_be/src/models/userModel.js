import pool from "../config/db.js";
import bcrypt from "bcrypt";

export const getAllUsersService = async () => {
	const result = await pool.query("SELECT * FROM users");
	return result.rows;
};

export const getUserByIdService = async (id) => {
	const result = await pool.query("SELECT name, username, email, created_at FROM users WHERE id = $1", [id]);
	return result.rows[0] || null;
};

export const getUserByEmailService = async (email) => {
	const result = await pool.query("SELECT * FROM users where email = $1", [email]);
	return result.rows[0];
};

export const createUserService = async (body) => {
	const hashedPassword = await bcrypt.hash(body.password, 10);
	const result = await pool.query(
		'INSERT INTO users (name, username, email, password, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING *',
		[body.name, body.username, body.email, hashedPassword, new Date()]
	);
	if (result.rows.length > 0) {
		return result.rows[0];
	} else {
		throw new Error("User creation failed");
	}
};

export const updateUserService = async (id, name, email) => {
	const result = await pool.query("UPDATE users SET name=$1, email=$2 WHERE id=$3 RETURNING *", [name, email, id]);
	return result.rows[0];
};

export const getUserCustomByIdService = async (id) => {
	const usernameResult = await pool.query("SELECT username FROM users WHERE id = $1", [id]);
	const userCustomResult = await pool.query("SELECT * FROM usercustom WHERE userid = $1", [id]);

	const username = usernameResult.rows[0]?.username || null;
	const userCustom = userCustomResult.rows[0] || null;

	// id와 userid 필드를 삭제
	if (userCustom) {
		delete userCustom.id;
		delete userCustom.userid;
	}

	return {
		username,
		userCustom,
	};
};

export const updateUserCustomService = async (id, body) => {
	// 필드 업데이트 함수
	console.log(body);
	const createUpdateQuery = (tableName, fieldsToUpdate, values, indexOffset = 1, id) => {
		const setClause = fieldsToUpdate.map((field, idx) => `${field}=$${idx + indexOffset}`).join(", ");
		const query = `
      UPDATE ${tableName}
      SET ${setClause}
      WHERE ${tableName === 'users' ? 'id' : 'userid'}=${id}
    RETURNING *;
    `;
		return { query, values };
	};

	// `users` 테이블 업데이트
	const userFieldsToUpdate = [];
	const userValues = [];
	if (body.username) {
		userFieldsToUpdate.push('username');
		userValues.push(body.username);
	}

	// `usercustom` 테이블 업데이트
	const userCustomFieldsToUpdate = [];
	const userCustomValues = [];
	const userCustomFields = [
		'gender', 'location', 'bio', 'serial_num', 'head', 'eyes', 'eyebrows',
		'nose', 'mouth', 'ears', 'hair', 'top', 'bottom', 'shoes'
	];

	userCustomFields.forEach((field) => {
		if (body[field] !== undefined) {
			userCustomFieldsToUpdate.push(field);
			userCustomValues.push(body[field]);
		}
	});

	let userResult = null;
	let userCustomResult = null;

	// 쿼리 실행
	if (userFieldsToUpdate.length > 0) {
		const userQueryData = createUpdateQuery('users', userFieldsToUpdate, userValues, 1, id);
		userResult = await pool.query(userQueryData.query, userQueryData.values);
	}
	if (userCustomFieldsToUpdate.length > 0) {
		const userCustomQueryData = createUpdateQuery('usercustom', userCustomFieldsToUpdate, userCustomValues, userFieldsToUpdate.length + 1, id);
		console.log(userCustomQueryData);
		userCustomResult = await pool.query(userCustomQueryData.query, userCustomQueryData.values);
		console.log(userCustomResult);
	}

	return {
		user: userResult ? userResult.rows[0] : null,
		userCustom: userCustomResult ? userCustomResult.rows[0] : null,
	};
};


export const deleteUserService = async (id) => {
	const result = await pool.query("DELETE FROM users WHERE id=$1 RETURNING *", [id]);
	return result.rows[0];
};