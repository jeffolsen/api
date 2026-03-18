import express from "express";
import authorizeScope from "../middleware/authorizeScope";
import {
  DELETE_ITEM_SCOPE,
  DELETE_DATE_RANGE_SCOPE,
  READ_ITEM_SCOPE,
  READ_DATE_RANGE_SCOPE,
  DATE_RANGE_ROUTES,
  ID_PARAM,
  ITEM_ID_PARAM,
} from "../config/constants";
import itemDateRangeApi from "../controllers/itemDateRange";

const router = express.Router();

router.get(
  ITEM_ID_PARAM + DATE_RANGE_ROUTES,
  authorizeScope([READ_ITEM_SCOPE, READ_DATE_RANGE_SCOPE]),
  itemDateRangeApi.getItemDateRanges,
);

router.get(
  ITEM_ID_PARAM + DATE_RANGE_ROUTES + ID_PARAM,
  authorizeScope([READ_ITEM_SCOPE, READ_DATE_RANGE_SCOPE]),
  itemDateRangeApi.getItemDateRangeById,
);

router.delete(
  ITEM_ID_PARAM + DATE_RANGE_ROUTES + ID_PARAM,
  authorizeScope([
    READ_ITEM_SCOPE,
    READ_DATE_RANGE_SCOPE,
    DELETE_ITEM_SCOPE,
    DELETE_DATE_RANGE_SCOPE,
  ]),
  itemDateRangeApi.deleteItemDateRange,
);

export default router;
