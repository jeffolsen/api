import express from "express";
import authorizeScope from "../middleware/authorizeScope";
import { COLLECTION_ENDPOINT, READ_TAG_SCOPE } from "../config/constants";
import tagApi from "../controllers/tag";

const router = express.Router();

router.get(
  COLLECTION_ENDPOINT,
  authorizeScope([READ_TAG_SCOPE]),
  tagApi.getAllTags,
);

export default router;
