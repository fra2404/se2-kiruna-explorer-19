import express from 'express';
import { authenticateUser } from '@middlewares/auth.middleware';
import { authorizeRoles } from '@middlewares/role.middleware';
import {
  validateCoordinate,
  validateId,
} from '@utils/validators/coordinate.validator';
import { handleValidationErrors } from '@middlewares/validation.middleware';
import {
  addCoordinate,
  deleteCoordinateController,
  getAllCoordinatesController,
  getCoordinateByIdController,
} from '@controllers/coordinate.controllers';

const router = express.Router();

router.post(
  '/create',
  authenticateUser,
  authorizeRoles('PLANNER', 'DEVELOPER'),
  validateCoordinate,
  handleValidationErrors,
  addCoordinate,
);
router.get('/', getAllCoordinatesController);
router.get(
  '/:id',
  validateId,
  handleValidationErrors,
  getCoordinateByIdController,
);
router.delete('/', deleteCoordinateController);

export const coordinateRoutes = router;
