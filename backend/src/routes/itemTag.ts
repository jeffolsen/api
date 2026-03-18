import express from "express";
import authorizeScope from "../middleware/authorizeScope";
import {
  DELETE_ITEM_SCOPE,
  DELETE_TAG_SCOPE,
  ID_PARAM,
  ITEM_ID_PARAM,
  READ_ITEM_SCOPE,
  READ_TAG_SCOPE,
  TAG_ROUTES,
} from "../config/constants";
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
  authorizeScope([
    READ_ITEM_SCOPE,
    READ_TAG_SCOPE,
    DELETE_ITEM_SCOPE,
    DELETE_TAG_SCOPE,
  ]),
  itemTagApi.deleteItemTag,
);

export default router;
