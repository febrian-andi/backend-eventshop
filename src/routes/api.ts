import express from "express";
import authRoutes from "./auth.routes";
import mediaRoutes from "./media.routes";
import categoryRoutes from "./category.routes";


const router = express.Router();

router.use(authRoutes)
router.use(mediaRoutes);
router.use(categoryRoutes);

export default router;
