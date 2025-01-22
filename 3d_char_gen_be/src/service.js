import express from 'express';
import cors from "cors";
import dotenv from "dotenv";
import pool from './config/db.js';

import userRoutes from "./routes/api/userRoutes.js"
import authRoutes from "./routes/api/authRoutes.js"
import errorHandling from './middleware/errorHandler.js';
import createUserTable from './data/createUserTable.js';
import { port } from './config/env.js';

dotenv.config();

const app = express();
const PORT = port;

//MIDDLEWARE
app.use(express.json());

const corsOptions = {
	origin: 'http://localhost:3000', // 요청을 허용할 도메인
	credentials: true, // 쿠키와 인증 정보를 허용
};

app.use(cors(corsOptions));

//CREATE TABLES 
createUserTable();

//ROUTES
app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);

//ERROR
app.use(errorHandling);

//TESTING POSTGRES
app.get("/", async (req, res) => {
	const result = await pool.query("SELECT current_database()");
	res.send(`The database name is: ${result.rows[0].current_database}`);
});

//SERVER RUNNING
app.listen(PORT, () => {
	console.log(`server has started on port: ${PORT}`);
});