import express from "express";
import authApi from "../controllers/auth";

const router = express.Router();

router.post("/register", authApi.register);
router.post("/login", authApi.login);
router.post("/logout", authApi.logout);
router.post("/logout-all", authApi.logoutOfAll);
router.post("/reset-password", authApi.requestPasswordReset);

export default router;
