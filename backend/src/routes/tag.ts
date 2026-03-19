import express from "express";
import authorizeScope from "../middleware/authorizeScope";
import { READ_TAG_SCOPE } from "../config/scopes";
import { COLLECTION_ENDPOINT } from "../config/routes";
import tagApi from "../controllers/tag";

const router = express.Router();

router.get(
  COLLECTION_ENDPOINT,
  authorizeScope([READ_TAG_SCOPE]),
  tagApi.getAllTags,
);

export default router;
