import express from "express";
import authApi from "../controllers/auth";
import {
  AUTH_DELETE_PROFILE_ENDPOINT,
  AUTH_LOGIN_ENDPOINT,
  AUTH_LOGOUT_ALL_ENDPOINT,
  AUTH_PASSWORD_RESET_ENDPOINT,
  AUTH_REGISTER_ENDPOINT,
  AUTH_REFRESH_ENDPOINT,
  AUTH_LOGOUT_ENDPOINT,
} from "../config/constants";

const router = express.Router();

router.post(AUTH_REGISTER_ENDPOINT, authApi.register);
router.post(AUTH_REFRESH_ENDPOINT, authApi.refreshToken);
router.post(AUTH_LOGOUT_ENDPOINT, authApi.loginWithVerificationCode);
router.post(AUTH_LOGOUT_ENDPOINT, authApi.loginWithApiKey);

export default router;
