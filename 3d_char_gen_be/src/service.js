import express from 'express';
import cors from "cors";
import dotenv from "dotenv";
import pool from './config/db.js';

import userRoutes from "./routes/api/userRoutes.js"
import errorHandling from './middleware/errorHandler.js';
import createUserTable from './data/createUserTable.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5003;

//MIDDLEWARE
app.use(express.json());
app.use(cors());

//ROUTES
app.use("/api", userRoutes);

//ERROR
app.use(errorHandling);

//CREATE TABLES 
createUserTable();

//TESTING POSTGRES
app.get("/", async (req, res) => {
	const result = await pool.query("SELECT current_database()");
	res.send(`The database name is: ${result.rows[0].current_database}`);
});

//SERVER RUNNING
app.listen(PORT, () => {
	console.log(`server has started on port: ${PORT}`);
});