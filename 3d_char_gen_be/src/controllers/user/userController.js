import {
	createUserService,
	getAllUsersService,
	getUserByIdService,
	getUserCustomByIdService,
	updateUserService,
	updateUserCustomService
} from "../../models/userModel.js";

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
		const user = await getUserByIdService(req.params.id);
		if (!user) return handleResponse(res, 404, "User not found");
		handleResponse(res, 201, "user fetched successfully", user);
	} catch (err) {
		next(err);
	}
};

export const updateUser = async (req, res, next) => {
	const { name, email } = req.body;
	try {
		const updatedUser = await updateUserService(req.params.id, name, email);
		if (!updatedUser) return handleResponse(res, 404, "User not found");
		handleResponse(res, 201, "user updated successfully", updatedUser);
	} catch (err) {
		next(err);
	}
};

export const getUserCustomById = async (req, res, next) => {
	try {
		const getUserCustom = await getUserCustomByIdService(req.params.id);
		if (!getUserCustom) return handleResponse(res, 404, "User not found");
		handleResponse(res, 201, "successfully get user custom", getUserCustom);
	} catch (err) {
		next(err);
	}
};

export const updateUserCustom = async (req, res, next) => {
	console.log("updateUserCustom start");
	try {
		const updatedUser = await updateUserCustomService(req.params.id, req.body);
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