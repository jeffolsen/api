import express from "express";
import authorizeScope from "../middleware/authorizeScope";
import {
  COLLECTION_ENDPOINT,
  CREATE_COMPONENT_SCOPE,
  DELETE_COMPONENT_SCOPE,
  ID_ENDPOINT,
  READ_COMPONENT_SCOPE,
  UPDATE_COMPONENT_SCOPE,
} from "../config/constants";
import componentApi from "../controllers/component";

const router = express.Router();

router.get(
  COLLECTION_ENDPOINT,
  authorizeScope([READ_COMPONENT_SCOPE]),
  componentApi.getAllComponents,
);
router.get(
  ID_ENDPOINT,
  authorizeScope([READ_COMPONENT_SCOPE]),
  componentApi.getComponentById,
);
router.post(
  COLLECTION_ENDPOINT,
  authorizeScope([CREATE_COMPONENT_SCOPE]),
  componentApi.createComponent,
);
router.patch(
  ID_ENDPOINT,
  authorizeScope([UPDATE_COMPONENT_SCOPE]),
  componentApi.updateComponent,
);
router.delete(
  ID_ENDPOINT,
  authorizeScope([DELETE_COMPONENT_SCOPE]),
  componentApi.deleteComponent,
);

export default router;
