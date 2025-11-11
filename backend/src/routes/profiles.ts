import express from "express";

const router = express.Router();

router.get("/", (req, res) => res.send("TODO: profile list"));
router.post("/signup", (req, res) => res.send("TODO: profile signup"));
router.post("/login", (req, res) => res.send("TODO: profile login"));
router.post("/logout", (req, res) => res.send("TODO: profile logout"));

export default router;
