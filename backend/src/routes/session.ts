import express from "express";
import sessionApi from "../controllers/session";

const router = express.Router();

router.get("/", sessionApi.getAllSessions);

export default router;
