
import express from 'express';
import { authenticateUser } from '@middlewares/auth.middleware';
import { authorizeRoles } from '@middlewares/role.middleware';
import { validateCoordinate } from '@utils/validators/coordinate.validator';
import { handleValidationErrors } from '@middlewares/validation.middleware';
import { addCoordinate, getAllCoordinatesController } from '@controllers/coordinate.controllers';

const router = express.Router();

router.post('/create', authenticateUser, authorizeRoles('PLANNER', 'DEVELOPER'), validateCoordinate, handleValidationErrors, addCoordinate);
router.get('/', getAllCoordinatesController);

export const coordinateRoutes = router;
