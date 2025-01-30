import pool from "../config/db.js";

export const getCustomGroupsService = async () => {
	const result = await pool.query("SELECT * FROM customgroups");
	return result.rows;
};

export const getCustomAssetsService = async () => {
	const result = await pool.query("SELECT * FROM customassets");
	return result.rows;
};