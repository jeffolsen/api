import express from "express";
import verificationCodeApi from "../controllers/verificationCode";
import authorizeScope from "../middleware/authorizeScope";
import {
  READ_VERIFICATION_CODE_SCOPE,
  VERIFICATION_CODE_LOGIN_ENDPOINT,
  VERIFICATION_CODE_LOGOUT_ALL_ENDPOINT,
  VERIFICATION_CODE_PASSWORD_RESET_ENDPOINT,
  VERIFICATION_CODE_DELETE_PROFILE_ENDPOINT,
  VERIFICATION_CODE_CREATE_API_KEY_ENDPOINT,
  COLLECTION_ENDPOINT,
  CREATE_API_KEY_SCOPE,
} from "../config/constants";
import authenticate from "../middleware/authenticate";

const router = express.Router();

router.get(
  COLLECTION_ENDPOINT,
  authenticate,
  authorizeScope([READ_VERIFICATION_CODE_SCOPE]),
  verificationCodeApi.getProfileVerificationCodes,
);
router.post(
  VERIFICATION_CODE_CREATE_API_KEY_ENDPOINT,
  authenticate,
  authorizeScope([CREATE_API_KEY_SCOPE]),
  verificationCodeApi.requestVerificationCode,
);
router.post(
  VERIFICATION_CODE_LOGIN_ENDPOINT,
  verificationCodeApi.requestVerificationCode,
);
router.post(
  VERIFICATION_CODE_DELETE_PROFILE_ENDPOINT,
  verificationCodeApi.requestVerificationCode,
);
router.post(
  VERIFICATION_CODE_LOGOUT_ALL_ENDPOINT,
  verificationCodeApi.requestVerificationCode,
);
router.post(
  VERIFICATION_CODE_PASSWORD_RESET_ENDPOINT,
  verificationCodeApi.requestVerificationCode,
);

export default router;
