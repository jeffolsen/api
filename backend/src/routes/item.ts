import express from "express";
import authorizeScope from "../middleware/authorizeScope";
import {
  COLLECTION_ENDPOINT,
  CREATE_ITEM_SCOPE,
  DELETE_ITEM_SCOPE,
  ID_ENDPOINT,
  READ_ITEM_SCOPE,
  UPDATE_ITEM_SCOPE,
} from "../config/constants";
import itemApi from "../controllers/item";

const router = express.Router();

router.get(
  COLLECTION_ENDPOINT,
  authorizeScope([READ_ITEM_SCOPE]),
  itemApi.getAllItems,
);
router.get(ID_ENDPOINT, authorizeScope([READ_ITEM_SCOPE]), itemApi.getItemById);
router.post(
  COLLECTION_ENDPOINT,
  authorizeScope([CREATE_ITEM_SCOPE]),
  itemApi.createItem,
);
router.patch(
  ID_ENDPOINT,
  authorizeScope([UPDATE_ITEM_SCOPE]),
  itemApi.updateItem,
);
router.delete(
  ID_ENDPOINT,
  authorizeScope([DELETE_ITEM_SCOPE]),
  itemApi.deleteItem,
);

export default router;
