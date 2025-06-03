import express from "express";
import authRoutes from "./auth.routes";
import mediaRoutes from "./media.routes";
import categoryRoutes from "./category.routes";
import regionRoutes from "./region.routes";
import eventRoutes from "./event.routes";

const router = express.Router();

router.use(authRoutes)
router.use(mediaRoutes);
router.use(categoryRoutes);
router.use(regionRoutes);
router.use(eventRoutes);

export default router;
