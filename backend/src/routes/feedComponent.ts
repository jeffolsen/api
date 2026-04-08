import express from "express";
import authorizeScope from "../middleware/authorizeScope";
import {
  READ_FEED_SCOPE,
  READ_COMPONENT_SCOPE,
  DELETE_COMPONENT_SCOPE,
  UPDATE_FEED_SCOPE,
} from "../config/scopes";
import { COMPONENT_ROUTES, ID_PARAM, FEED_ID_PARAM } from "../config/routes";
import feedComponentsApi from "../controllers/feedComponents";

const router = express.Router();

router.get(
  FEED_ID_PARAM + COMPONENT_ROUTES,
  authorizeScope([READ_FEED_SCOPE, READ_COMPONENT_SCOPE]),
  feedComponentsApi.getFeedComponents,
);

router.get(
  FEED_ID_PARAM + COMPONENT_ROUTES + ID_PARAM,
  authorizeScope([READ_FEED_SCOPE, READ_COMPONENT_SCOPE]),
  feedComponentsApi.getFeedComponentsById,
);

export default router;
