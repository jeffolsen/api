import express from "express";
import authorizeScope from "../middleware/authorizeScope";
import {
  DELETE_ITEM_SCOPE,
  DELETE_IMAGE_SCOPE,
  READ_ITEM_SCOPE,
  READ_IMAGE_SCOPE,
  IMAGE_ROUTES,
  ID_PARAM,
  ITEM_ID_PARAM,
} from "../config/constants";
import itemImageApi from "../controllers/itemImage";

const router = express.Router();

router.get(
  ITEM_ID_PARAM + IMAGE_ROUTES,
  authorizeScope([READ_ITEM_SCOPE, READ_IMAGE_SCOPE]),
  itemImageApi.getItemImages,
);

router.get(
  ITEM_ID_PARAM + IMAGE_ROUTES + ID_PARAM,
  authorizeScope([READ_ITEM_SCOPE, READ_IMAGE_SCOPE]),
  itemImageApi.getItemImageById,
);

router.delete(
  ITEM_ID_PARAM + IMAGE_ROUTES + ID_PARAM,
  authorizeScope([
    READ_ITEM_SCOPE,
    READ_IMAGE_SCOPE,
    DELETE_ITEM_SCOPE,
    DELETE_IMAGE_SCOPE,
  ]),
  itemImageApi.deleteItemImage,
);

export default router;
