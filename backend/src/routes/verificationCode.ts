import express from "express";
import verificationCodeApi from "../controllers/verificationCode";
import authorizeScope from "../middleware/authorizeScope";
import {
  READ_VERIFICATION_CODE_SCOPE,
  LOGIN_SCOPE,
  PASSWORD_RESET_SCOPE,
  VERIFICATION_CODE_LOGIN_ENDPOINT,
  VERIFICATION_CODE_LOGOUT_ALL_ENDPOINT,
  VERIFICATION_CODE_PASSWORD_RESET_ENDPOINT,
  VERIFICATION_CODE_DELETE_PROFILE_ENDPOINT,
} from "../config/constants";

const router = express.Router();

router.get(
  "/",
  authorizeScope([READ_VERIFICATION_CODE_SCOPE]),
  verificationCodeApi.getProfileVerificationCodes,
);
router.post(
  VERIFICATION_CODE_LOGIN_ENDPOINT,
  authorizeScope([LOGIN_SCOPE]),
  verificationCodeApi.submitVerificationCodeForLogin,
);
router.post(
  VERIFICATION_CODE_LOGOUT_ALL_ENDPOINT,
  authorizeScope([PASSWORD_RESET_SCOPE]),
  verificationCodeApi.submitVerificationCodeForLogoutAll,
);
router.post(
  VERIFICATION_CODE_PASSWORD_RESET_ENDPOINT,
  authorizeScope([PASSWORD_RESET_SCOPE]),
  verificationCodeApi.submitVerificationCodeForPasswordReset,
);
router.post(
  VERIFICATION_CODE_DELETE_PROFILE_ENDPOINT,
  authorizeScope([PASSWORD_RESET_SCOPE]),
  verificationCodeApi.submitVerificationCodeForDeleteProfile,
);

export default router;
