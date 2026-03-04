import express from "express";
import { COLLECTION_ENDPOINT, IMAGE_ID_ENDPOINT } from "../config/constants";
import imageApi from "../controllers/image";

const router = express.Router();

router.get(COLLECTION_ENDPOINT, imageApi.getAllImages);

router.get(IMAGE_ID_ENDPOINT, imageApi.getImageById);

export default router;
