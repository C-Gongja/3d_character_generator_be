import errorHandling from "../middleware/errorHandler.js";
import { createUserService, getAllUsersService, updateUserService } from "../models/userModel.js";

//standardized response function 
const handleResponse = (res, status, message, data = null) => {
	res.status(status).json({
		status,
		message,
		data,
	});
};

export const createUser = async (req, res, next) => {
	const { name, email } = req.body;

	try {
		const newUser = await createUserService(name, email);
		handleResponse(res, 201, "user created successfully", newUser);
	} catch (err) {
		next(err);
	}
};

export const getAllUsers = async (req, res, next) => {
	try {
		const users = await getAllUsersService();
		handleResponse(res, 201, "user fetched successfully", users);
	} catch (err) {
		next(err);
	}
};

export const getUserById = async (req, res, next) => {
	try {
		const user = await getUserById(req.param.id);
		if (!user) return handleResponse(res, 404, "User not found");
		handleResponse(res, 201, "user fetched successfully", users);
	} catch (err) {
		next(err);
	}
};

export const updateUser = async (req, res, next) => {
	const { name, email } = req.body;
	try {
		const updatedUser = await updateUserService(req.param.id, name, email);
		if (!updatedUser) return handleResponse(res, 404, "User not found");
		handleResponse(res, 201, "user updated successfully", updatedUser);
	} catch (err) {
		next(err);
	}
};

export const deleteUser = async (req, res, next) => {
	try {
		const user = await deleteUser(req.param.id);
		if (!user) return handleResponse(res, 404, "User not found");
		handleResponse(res, 201, "user deleted successfully", user);
	} catch (err) {
		next(err);
	}
};