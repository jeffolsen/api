import express from "express";
import authorizeScope from "../middleware/authorizeScope";
import {
  CREATE_FEED_SCOPE,
  DELETE_FEED_SCOPE,
  READ_FEED_SCOPE,
  UPDATE_FEED_SCOPE,
} from "../config/scopes";
import { COLLECTION_ENDPOINT, ID_PARAM, PATH_PARAM } from "../config/routes";
import feedApi from "../controllers/feed";

const router = express.Router();

router.get(
  COLLECTION_ENDPOINT,
  authorizeScope([READ_FEED_SCOPE]),
  feedApi.getAllFeeds,
);
router.get(ID_PARAM, authorizeScope([READ_FEED_SCOPE]), feedApi.getFeedById);
router.get(
  PATH_PARAM,
  authorizeScope([READ_FEED_SCOPE]),
  feedApi.getFeedByPath,
);
router.post(
  COLLECTION_ENDPOINT,
  authorizeScope([CREATE_FEED_SCOPE]),
  feedApi.createFeed,
);
router.put(ID_PARAM, authorizeScope([UPDATE_FEED_SCOPE]), feedApi.updateFeed);
router.delete(
  ID_PARAM,
  authorizeScope([DELETE_FEED_SCOPE]),
  feedApi.deleteFeed,
);

export default router;
