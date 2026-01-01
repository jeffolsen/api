import express from "express";
import authorizeScope from "../middleware/authorizeScope";
import {
  COLLECTION_ENDPOINT,
  READ_TAG_SCOPE,
  TAG_NAME_ENDPOINT,
} from "../config/constants";
import tagApi from "../controllers/tag";

const router = express.Router();

router.get(
  COLLECTION_ENDPOINT,
  authorizeScope([READ_TAG_SCOPE]),
  tagApi.getAllTags,
);
router.get(
  TAG_NAME_ENDPOINT,
  authorizeScope([READ_TAG_SCOPE]),
  tagApi.getTagByName,
);

export default router;
