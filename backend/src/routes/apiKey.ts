import express from "express";
import apiKeyApi from "../controllers/apiKey";
import authorizeScope from "../middleware/authorizeScope";
import {
  API_KEY_GENERATE_ENDPOINT,
  COLLECTION_ENDPOINT,
  READ_API_KEY_SCOPE,
} from "../config/constants";

const router = express.Router();

router.get(
  COLLECTION_ENDPOINT,
  authorizeScope([READ_API_KEY_SCOPE]),
  apiKeyApi.getProfilesApiKeys,
);
router.post(API_KEY_GENERATE_ENDPOINT, apiKeyApi.generateApiKey);

export default router;
