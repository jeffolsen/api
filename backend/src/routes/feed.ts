import express from "express";
import authorizeScope from "../middleware/authorizeScope";
import {
  COLLECTION_ENDPOINT,
  CREATE_FEED_SCOPE,
  DELETE_FEED_SCOPE,
  ID_ENDPOINT,
  READ_FEED_SCOPE,
  UPDATE_FEED_SCOPE,
} from "../config/constants";
import feedApi from "../controllers/feed";

const router = express.Router();

router.get(
  COLLECTION_ENDPOINT,
  authorizeScope([READ_FEED_SCOPE]),
  feedApi.getAllFeeds,
);
router.get(ID_ENDPOINT, authorizeScope([READ_FEED_SCOPE]), feedApi.getFeedById);
router.post(
  COLLECTION_ENDPOINT,
  authorizeScope([CREATE_FEED_SCOPE]),
  feedApi.createFeed,
);
router.patch(
  ID_ENDPOINT,
  authorizeScope([UPDATE_FEED_SCOPE]),
  feedApi.updateFeed,
);
router.delete(
  ID_ENDPOINT,
  authorizeScope([DELETE_FEED_SCOPE]),
  feedApi.deleteFeed,
);

export default router;
