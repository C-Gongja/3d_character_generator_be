import pool from "../config/db.js";
import bcrypt from "bcrypt";

export const getAllUsersService = async () => {
	const result = await pool.query("SELECT * FROM users");
	return result.rows;
};

export const getUserByIdService = async (user) => {
	const result = await pool.query("SELECT id, name, username, email FROM users WHERE id = $1", [user.id]);
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
	} else {
		return null;
	}

	return {
		username,
		userCustom,
	};
};

export const createUserCustomService = async (id, body) => {
	const fields = [];
	const values = [];
	const placeholders = [];

	let index = 1;

	// body의 키-값 쌍을 순회하며 null이 아닌 것만 처리
	for (const [key, value] of Object.entries(body)) {
		if (value !== null && key !== 'username') {
			// JSONB 필드는 JSON 객체 형식으로 처리
			if (typeof value === 'object' && value !== null) {
				// JSONB 필드는 JSON 객체를 그대로 넣을 수 있도록 처리
				fields.push(`"${key}"`);
				values.push(JSON.stringify(value)); // JSON 객체를 문자열로 변환
				placeholders.push(`$${index}`);
				index++;
			} else {
				// 일반적인 필드는 그대로 처리
				fields.push(`"${key}"`);
				values.push(value);
				placeholders.push(`$${index}`);
				index++;
			}
		}
	}

	// userid는 무조건 넣는다고 가정
	fields.push('userid');
	values.push(id);
	placeholders.push(`$${index}`);

	const query = `
			INSERT INTO usercustom (${fields.join(', ')})
			VALUES (${placeholders.join(', ')})
			RETURNING *
		`;

	const result = await pool.query(query, values);

	if (result.rows.length > 0) {
		return result.rows[0];
	} else {
		throw new Error("User Custom creation failed");
	}
};

export const updateUserCustomService = async (id, body) => {
	const createUpdateQuery = (tableName, fieldsToUpdate, values, indexOffset = 1, id) => {
		const setClause = fieldsToUpdate.map((field, idx) => `"${field}"=$${idx + indexOffset}`).join(", ");
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
		'gender', 'location', 'bio', 'serial_num', 'Head', 'Eyes', 'Eyebrows',
		'Nose', 'Mouth', 'Ears', 'Hair', 'Top', 'Bottom', 'Shoes'
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
		userCustomResult = await pool.query(userCustomQueryData.query, userCustomQueryData.values);
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