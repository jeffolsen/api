import express from "express";
import authorizeScope from "@middleware/authorizeScope";
import { READ_FEED_SCOPE, READ_TAG_SCOPE } from "@config/scopes";
import { TAG_ROUTES, ID_PARAM, FEED_ID_PARAM } from "@config/routes";
import feedTagApi from "@controllers/feedTags";

const router = express.Router();

router.get(
  FEED_ID_PARAM + TAG_ROUTES,
  authorizeScope([READ_FEED_SCOPE, READ_TAG_SCOPE]),
  feedTagApi.getFeedTags,
);

router.get(
  FEED_ID_PARAM + TAG_ROUTES + ID_PARAM,
  authorizeScope([READ_FEED_SCOPE, READ_TAG_SCOPE]),
  feedTagApi.getFeedTagById,
);

export default router;
