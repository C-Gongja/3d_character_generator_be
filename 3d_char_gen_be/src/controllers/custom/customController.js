import { getCustomAssetsService, getCustomGroupsService } from "../../models/customModel.js";

//standardized response function 
const handleResponse = (res, status, message, data = null) => {
	res.status(status).json({
		status,
		message,
		data,
	});
};

export const getCustomGroups = async (req, res, next) => {
	try {
		const customGroups = await getCustomGroupsService();
		handleResponse(res, 201, "customGroups fetched successfully", customGroups);
	} catch (err) {
		next(err);
	}
};

export const getCustomAssets = async (req, res, next) => {
	try {
		const customAssets = await getCustomAssetsService();
		handleResponse(res, 201, "customAssets fetched successfully", customAssets);
	} catch (err) {
		next(err);
	}
};
