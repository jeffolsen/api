import express from "express";
import apiKeyApi from "../controllers/apiKey";
import authorizeScope from "../middleware/authorizeScope";
import {
  API_KEY_GENERATE_ENDPOINT,
  API_KEY_PUBLIC_ENDPOINT,
  COLLECTION_ENDPOINT,
  CREATE_API_KEY_SCOPE,
  READ_API_KEY_SCOPE,
} from "../config/constants";
import authenticate from "../middleware/authenticate";

const router = express.Router();

router.get(
  COLLECTION_ENDPOINT,
  authenticate,
  authorizeScope([READ_API_KEY_SCOPE]),
  apiKeyApi.getProfilesApiKeys,
);
router.post(
  API_KEY_GENERATE_ENDPOINT,
  authenticate,
  authorizeScope([CREATE_API_KEY_SCOPE]),
  apiKeyApi.generate,
);
router.post(API_KEY_PUBLIC_ENDPOINT, apiKeyApi.connect);

export default router;
