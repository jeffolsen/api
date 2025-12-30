import express from "express";
import authorizeScope from "../middleware/authorizeScope";
import {
  COLLECTION_ENDPOINT,
  CREATE_TAG_SCOPE,
  DELETE_TAG_SCOPE,
  ID_ENDPOINT,
  READ_TAG_SCOPE,
  UPDATE_TAG_SCOPE,
} from "../config/constants";
import tagApi from "../controllers/tag";

const router = express.Router();

router.get(
  COLLECTION_ENDPOINT,
  authorizeScope([READ_TAG_SCOPE]),
  tagApi.getAllTags,
);
router.get(ID_ENDPOINT, authorizeScope([READ_TAG_SCOPE]), tagApi.getTagById);
router.post(
  COLLECTION_ENDPOINT,
  authorizeScope([CREATE_TAG_SCOPE]),
  tagApi.createTag,
);
router.patch(ID_ENDPOINT, authorizeScope([UPDATE_TAG_SCOPE]), tagApi.updateTag);
router.delete(
  ID_ENDPOINT,
  authorizeScope([DELETE_TAG_SCOPE]),
  tagApi.deleteTag,
);

export default router;
