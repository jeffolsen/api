import express from "express";
import { COLLECTION_ENDPOINT, ID_PARAM } from "../config/constants";
import imageApi from "../controllers/image";

const router = express.Router();

router.get(COLLECTION_ENDPOINT, imageApi.getAllImages);

router.get(ID_PARAM, imageApi.getImageById);

export default router;
