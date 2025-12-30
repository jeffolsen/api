import express from "express";
import authorizeScope from "../middleware/authorizeScope";
import { COLLECTION_ENDPOINT, OK, READ_FEED_SCOPE } from "../config/constants";
import catchErrors from "../util/catchErrors";

const router = express.Router();

router.get(
  COLLECTION_ENDPOINT,
  authorizeScope([READ_FEED_SCOPE]),
  catchErrors(async (req, res, next) => {
    res.status(OK).json({ message: "you did it" });
  }),
);

export default router;
