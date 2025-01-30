import express from "express";
import { getCustomAssets, getCustomGroups } from "../../controllers/custom/customController.js";

const router = express.Router();

router.get("/customGroups", getCustomGroups);
router.get("/customAssets", getCustomAssets);

export default router;