import express from "express";
import { COLLECTION_ENDPOINT, ID_PARAM } from "../config/routes";
import imageApi from "../controllers/image";
import { READ_IMAGE_SCOPE } from "../config/scopes";
import authorizeScope from "../middleware/authorizeScope";

const router = express.Router();

router.get(
  COLLECTION_ENDPOINT,
  authorizeScope([READ_IMAGE_SCOPE]),
  imageApi.getAllImages,
);

router.get(ID_PARAM, authorizeScope([READ_IMAGE_SCOPE]), imageApi.getImageById);

export default router;
