import express from 'express';
import userRoutes from './user.routes';
import documentRoutes from "./document.routes"

const router = express.Router();

router.use('/users', userRoutes);
router.use("/documents", documentRoutes)

export default router;
