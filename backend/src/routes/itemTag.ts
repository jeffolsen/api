import express from "express";
import authorizeScope from "../middleware/authorizeScope";
import {
  UPDATE_ITEM_SCOPE,
  READ_ITEM_SCOPE,
  READ_TAG_SCOPE,
} from "../config/scopes";
import { TAG_ROUTES, ID_PARAM, ITEM_ID_PARAM } from "../config/routes";
import itemTagApi from "../controllers/itemTag";

const router = express.Router();

router.get(
  ITEM_ID_PARAM + TAG_ROUTES,
  authorizeScope([READ_ITEM_SCOPE, READ_TAG_SCOPE]),
  itemTagApi.getItemTags,
);

router.get(
  ITEM_ID_PARAM + TAG_ROUTES + ID_PARAM,
  authorizeScope([READ_ITEM_SCOPE, READ_TAG_SCOPE]),
  itemTagApi.getItemTagById,
);

router.delete(
  ITEM_ID_PARAM + TAG_ROUTES + ID_PARAM,
  authorizeScope([READ_ITEM_SCOPE, READ_TAG_SCOPE, UPDATE_ITEM_SCOPE]),
  itemTagApi.deleteItemTag,
);

export default router;
