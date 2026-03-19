import express from "express";
import authorizeScope from "../middleware/authorizeScope";
import {
  UPDATE_ITEM_SCOPE,
  READ_ITEM_SCOPE,
  READ_IMAGE_SCOPE,
} from "../config/scopes";
import { IMAGE_ROUTES, ID_PARAM, ITEM_ID_PARAM } from "../config/routes";
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
  authorizeScope([READ_ITEM_SCOPE, READ_IMAGE_SCOPE, UPDATE_ITEM_SCOPE]),
  itemImageApi.deleteItemImage,
);

export default router;
