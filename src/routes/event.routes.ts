import express from "express";
import eventController from "../controllers/event.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import aclMiddleware from "../middlewares/acl.middleware";
import { ROLES } from "../utils/constant";

const router = express.Router();

router.post(
  "/events",
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  eventController.create
);
router.get("/events", eventController.findAll);
router.get("/events/:id", eventController.findOne);
router.get("/events/slug/:slug", eventController.findOneBySlug);
router.put(
  "/events/:id",
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  eventController.update
);
router.delete(
  "/events/:id",
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  eventController.remove
);

export default router;
