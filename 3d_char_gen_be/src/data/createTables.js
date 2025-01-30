import fs from "fs";
import path from "path";
import pool from "../config/db.js";

const createTablesFromFile = async () => {
	try {
		const sqlFilePath = path.resolve("./src/data/data.sql");
		const sqlContent = fs.readFileSync(sqlFilePath, "utf-8");

		const queries = sqlContent.split(";").map((query) => query.trim()).filter((query) => query);

		for (const query of queries) {
			try {
				await pool.query(query);
				console.log("Query executed successfully:", query.split("\n")[0]);
			} catch (error) {
				console.error("Error executing query:", query.split("\n")[0]);
				console.error("Error details:", error.message);
				throw error;
			}
		}
		console.log("All tables created successfully from data.sql");
	} catch (error) {
		console.error("Error creating tables from data.sql:", error);
	}
};

export default createTablesFromFile;
