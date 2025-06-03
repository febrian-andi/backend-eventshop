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
  /*
  #swagger.tags = ["Events"]
  #swagger.security = [{
    "bearerAuth": {}
  }]
  #swagger.requestBody = {
    required: true,
    schema: {
      $ref: "#/components/schemas/CreateOrUpdateEventRequest"
    }
  }
  */
);
router.get(
  "/events",
  eventController.findAll
  /*
  #swagger.tags = ["Events"]
  */
);
router.get(
  "/events/:id",
  eventController.findOne
  /*
  #swagger.tags = ["Category"]
  #swagger.parameters['id'] = {
    description: 'ID of the event to retrieve',
    type: 'string'
  }
  */
);
router.get(
  "/events/slug/:slug",
  eventController.findOneBySlug
  /*
  #swagger.tags = ["Category"]
  #swagger.parameters['slug'] = {
    description: 'Slug of the event to retrieve',
    type: 'string'
  }
  */
);
router.put(
  "/events/:id",
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  eventController.update
  /*
  #swagger.tags = ["Events"]
  #swagger.security = [{
    "bearerAuth": {}
  }]
  #swagger.requestBody = {
    required: true,
    schema: {
      $ref: "#/components/schemas/CreateOrUpdateEventRequest"
    }
  }
  #swagger.parameters['id'] = {
    description: 'ID of the event to update',
    type: 'integer'
  }
  */
);
router.delete(
  "/events/:id",
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  eventController.remove
  /*
  #swagger.tags = ["Events"]
  #swagger.security = [{
    "bearerAuth": {}
  }]
  #swagger.parameters['id'] = {
    description: 'ID of the event to delete',
    type: 'string'
  }
  */
);

export default router;
