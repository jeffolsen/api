import express from "express";
import authorizeScope from "@middleware/authorizeScope";
import { READ_COMPONENT_TYPE_SCOPE } from "@config/scopes";
import { COLLECTION_ENDPOINT, ID_PARAM, NAME_PARAM } from "@config/routes";
import componentTypeApi from "@controllers/componentType";

const router = express.Router();

router.get(
  COLLECTION_ENDPOINT,
  authorizeScope([READ_COMPONENT_TYPE_SCOPE]),
  componentTypeApi.getAllComponentTypes,
);
router.get(
  NAME_PARAM,
  authorizeScope([READ_COMPONENT_TYPE_SCOPE]),
  componentTypeApi.getComponentTypeByName,
);
router.get(
  ID_PARAM,
  authorizeScope([READ_COMPONENT_TYPE_SCOPE]),
  componentTypeApi.getComponentTypeById,
);

export default router;
