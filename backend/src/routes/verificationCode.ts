import express from "express";
import verificationCodeApi from "../controllers/verificationCode";

const router = express.Router();

router.get("/", verificationCodeApi.getAllVerificationCodes);

export default router;
