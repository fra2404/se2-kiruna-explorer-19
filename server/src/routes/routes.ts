import express from 'express';
import { userRoutes } from './user.routes';
import { documentRoutes } from './document.routes';
import { coordinateRoutes } from './coordinate.routes';

const router = express.Router();

router.use('/users', userRoutes);
router.use('/documents', documentRoutes);
router.use('/coordinates', coordinateRoutes);

export default router;
