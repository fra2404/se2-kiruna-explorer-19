import { handleValidationErrors } from '@middlewares/validation.middleware';
import express from 'express';
import { authenticateUser } from '@middlewares/auth.middleware';
import { authorizeRoles } from '@middlewares/role.middleware';
import { addStakeholderController } from '@controllers/stakeholder.controllers';
import { validateStakeholder } from '@utils/validators/stakeholder.validator';

const router = express.Router();

router.post(
    '/create',
    authenticateUser,
    authorizeRoles('PLANNER', 'DEVELOPER'),
    validateStakeholder,
    handleValidationErrors,
    addStakeholderController,
  );

  export const stakeholderRoutes = router;
