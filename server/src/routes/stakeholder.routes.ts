import { handleValidationErrors } from '@middlewares/validation.middleware';
import express from 'express';
import { authenticateUser } from '@middlewares/auth.middleware';
import { authorizeRoles } from '@middlewares/role.middleware';
import { addStakeholderController, deleteAllStakeholdersController, getAllStakeholdersController } from '@controllers/stakeholder.controllers';
import { validateNewStakeholderType } from '@utils/validators/stakeholder.validator';

const router = express.Router();

router.post(
  '/add',
  authenticateUser,
  authorizeRoles('PLANNER', 'DEVELOPER'),
  validateNewStakeholderType,
  handleValidationErrors,
  addStakeholderController,
);

router.get('/',
  handleValidationErrors,
  getAllStakeholdersController); //Get All Stakeholders

/*  instanbul ignore next */
router.delete('/', deleteAllStakeholdersController);
export const stakeholderRoutes = router;
