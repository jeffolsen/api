import express from "express";
import verificationCodeApi from "../controllers/verificationCode";
import authorizeScope from "../middleware/authorizeScope";
import {
  READ_VERIFICATION_CODE_SCOPE,
  CREATE_API_KEY_SCOPE,
  DELETE_PROFILE_SCOPE,
} from "../config/scopes";
import {
  COLLECTION_ENDPOINT,
  VERIFICATION_CODE_LOGIN_ENDPOINT,
  VERIFICATION_CODE_SESSION_RESET_ENDPOINT,
  VERIFICATION_CODE_PASSWORD_RESET_ENDPOINT,
  VERIFICATION_CODE_DELETE_PROFILE_ENDPOINT,
  VERIFICATION_CODE_MANAGE_API_KEY_ENDPOINT,
} from "../config/routes";
import authenticate from "../middleware/authenticate";

const router = express.Router();

router.get(
  COLLECTION_ENDPOINT,
  authenticate,
  authorizeScope([READ_VERIFICATION_CODE_SCOPE]),
  verificationCodeApi.getProfileVerificationCodes,
);
router.post(
  VERIFICATION_CODE_MANAGE_API_KEY_ENDPOINT,
  authenticate,
  authorizeScope([CREATE_API_KEY_SCOPE]),
  verificationCodeApi.requestVerificationCode,
);
router.post(
  VERIFICATION_CODE_DELETE_PROFILE_ENDPOINT,
  authenticate,
  authorizeScope([DELETE_PROFILE_SCOPE]),
  verificationCodeApi.requestVerificationCode,
);
router.post(
  VERIFICATION_CODE_LOGIN_ENDPOINT,
  verificationCodeApi.requestVerificationCode,
);
router.post(
  VERIFICATION_CODE_SESSION_RESET_ENDPOINT,
  verificationCodeApi.requestVerificationCode,
);
router.post(
  VERIFICATION_CODE_PASSWORD_RESET_ENDPOINT,
  verificationCodeApi.requestVerificationCode,
);

export default router;
