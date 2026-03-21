import express from "express";
import authorizeScope from "../middleware/authorizeScope";
import {
  CREATE_ITEM_SCOPE,
  DELETE_ITEM_SCOPE,
  READ_ITEM_SCOPE,
  UPDATE_ITEM_SCOPE,
} from "../config/scopes";
import { COLLECTION_ENDPOINT, ID_PARAM } from "../config/routes";
import itemApi from "../controllers/item";

const router = express.Router();

router.get(
  COLLECTION_ENDPOINT,
  authorizeScope([READ_ITEM_SCOPE]),
  itemApi.getAllItems,
);
router.get(ID_PARAM, authorizeScope([READ_ITEM_SCOPE]), itemApi.getItemById);
router.post(
  COLLECTION_ENDPOINT,
  authorizeScope([CREATE_ITEM_SCOPE]),
  itemApi.createItem,
);
router.put(ID_PARAM, authorizeScope([UPDATE_ITEM_SCOPE]), itemApi.updateItem);
router.patch(ID_PARAM, authorizeScope([UPDATE_ITEM_SCOPE]), itemApi.modifyItem);
router.delete(
  ID_PARAM,
  authorizeScope([DELETE_ITEM_SCOPE]),
  itemApi.deleteItem,
);

export default router;
