import express from "express";
import authorizeScope from "../middleware/authorizeScope";
import {
  CREATE_COMPONENT_SCOPE,
  DELETE_COMPONENT_SCOPE,
  READ_COMPONENT_SCOPE,
  UPDATE_COMPONENT_SCOPE,
} from "../config/scopes";
import { COLLECTION_ENDPOINT, ID_PARAM } from "../config/routes";
import componentApi from "../controllers/component";

const router = express.Router();

router.get(
  COLLECTION_ENDPOINT,
  authorizeScope([READ_COMPONENT_SCOPE]),
  componentApi.getAllComponents,
);
router.get(
  ID_PARAM,
  authorizeScope([READ_COMPONENT_SCOPE]),
  componentApi.getComponentById,
);
router.post(
  COLLECTION_ENDPOINT,
  authorizeScope([CREATE_COMPONENT_SCOPE]),
  componentApi.createComponent,
);
router.put(
  ID_PARAM,
  authorizeScope([UPDATE_COMPONENT_SCOPE]),
  componentApi.updateComponent,
);
router.patch(
  ID_PARAM,
  authorizeScope([UPDATE_COMPONENT_SCOPE]),
  componentApi.modifyComponent,
);
router.delete(
  ID_PARAM,
  authorizeScope([DELETE_COMPONENT_SCOPE]),
  componentApi.deleteComponent,
);

export default router;
