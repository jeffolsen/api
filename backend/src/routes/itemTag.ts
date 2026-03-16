import express from "express";
import authorizeScope from "../middleware/authorizeScope";
import {
  DELETE_ITEM_SCOPE,
  DELETE_TAG_SCOPE,
  READ_ITEM_SCOPE,
  READ_TAG_SCOPE,
} from "../config/constants";
import itemTagApi from "../controllers/itemTag";

const router = express.Router();

router.get(
  "/:itemId/tags",
  authorizeScope([READ_ITEM_SCOPE, READ_TAG_SCOPE]),
  itemTagApi.getItemTags,
);

router.get(
  "/:itemId/tags/:id",
  authorizeScope([READ_ITEM_SCOPE, READ_TAG_SCOPE]),
  itemTagApi.getItemTagById,
);

router.delete(
  "/:itemId/tags/:id",
  authorizeScope([
    READ_ITEM_SCOPE,
    READ_TAG_SCOPE,
    DELETE_ITEM_SCOPE,
    DELETE_TAG_SCOPE,
  ]),
  itemTagApi.deleteItemTag,
);

export default router;
