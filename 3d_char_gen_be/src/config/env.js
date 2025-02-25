import dotenv from "dotenv";

dotenv.config();

export const port = process.env.PORT || 5003;

export const jwtSecret = process.env.JWT_SECRET;
export const jwtAccExpTime = "2m";
export const jwtRefExpTime = "10m";
