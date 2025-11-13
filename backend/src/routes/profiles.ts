import express from "express";
import profileApi from "../controllers/profile";

const router = express.Router();

router.post("/register", profileApi.register);
router.post("/login", profileApi.login);
router.post("/logout", profileApi.logout);
router.post("/logout-all", profileApi.logoutOfAll);
router.post("/change-password", profileApi.changePassword);
router.post("/verify-email", profileApi.verifyEmail);
router.post("/delete", profileApi.deleteProfile);

export default router;
