import express from "express";
import authorizeScope from "../middleware/authorizeScope";
import {
  DELETE_ITEM_SCOPE,
  DELETE_IMAGE_SCOPE,
  READ_ITEM_SCOPE,
  READ_IMAGE_SCOPE,
} from "../config/constants";
import itemImageApi from "../controllers/itemImage";

const router = express.Router();

router.get(
  "/:itemId/images",
  authorizeScope([READ_ITEM_SCOPE, READ_IMAGE_SCOPE]),
  itemImageApi.getItemImages,
);

router.get(
  "/:itemId/images/:id",
  authorizeScope([READ_ITEM_SCOPE, READ_IMAGE_SCOPE]),
  itemImageApi.getItemImageById,
);

router.delete(
  "/:itemId/images/:id",
  authorizeScope([
    READ_ITEM_SCOPE,
    READ_IMAGE_SCOPE,
    DELETE_ITEM_SCOPE,
    DELETE_IMAGE_SCOPE,
  ]),
  itemImageApi.deleteItemImage,
);

export default router;
