import express from 'express';
import { createRouteHandler } from "uploadthing/express";
import { ourFileRouter } from "../upload/uploadRouter.js";
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

const uploadthingMiddleware = createRouteHandler({
  router: ourFileRouter,
  async middleware({ req, res }) {
    return { user: req.user };
  }
});

// This route serves as the endpoint for your client-side uploads.
router.use('/', authMiddleware, uploadthingMiddleware);

export default router;