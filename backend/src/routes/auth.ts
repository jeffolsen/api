import express from "express";
import authApi from "../controllers/auth";
import {
  AUTH_API_KEY_ENDPOINT,
  AUTH_LOGIN_ENDPOINT,
  AUTH_REGISTER_ENDPOINT,
  AUTH_REFRESH_ENDPOINT,
} from "../config/constants";

const router = express.Router();

router.post(AUTH_REGISTER_ENDPOINT, authApi.register);
router.post(AUTH_REFRESH_ENDPOINT, authApi.refreshToken);
router.post(AUTH_LOGIN_ENDPOINT, authApi.loginWithVerificationCode);
router.post(AUTH_API_KEY_ENDPOINT, authApi.loginWithApiKey);

export default router;
