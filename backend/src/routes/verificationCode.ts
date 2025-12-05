import express from "express";
import verificationCodeApi from "../controllers/verificationCode";
import authorizeScope from "../middleware/authorizeScope";
import {
  READ_VERIFICATION_CODE_SCOPE,
  UPDATE_EMAIL_SCOPE,
  UPDATE_PASSWORD_SCOPE,
} from "../config/constants";

const router = express.Router();

router.get(
  "/",
  authorizeScope([READ_VERIFICATION_CODE_SCOPE]),
  verificationCodeApi.getProfileVerificationCodes
);
router.post(
  "/email",
  authorizeScope([UPDATE_EMAIL_SCOPE]),
  verificationCodeApi.submitVerificationCodeForEmail
);
router.post(
  "/password",
  authorizeScope([UPDATE_PASSWORD_SCOPE]),
  verificationCodeApi.submitVerificationCodeForPassword
);

export default router;
