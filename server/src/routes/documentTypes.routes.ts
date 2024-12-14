import { handleValidationErrors } from '@middlewares/validation.middleware';
import express from 'express';
import { authenticateUser } from '@middlewares/auth.middleware';
import { authorizeRoles } from '@middlewares/role.middleware';
import { addDocumentTypeController, getAllDocumentTypesController } from '@controllers/documentType.controllers';
import { validateNewDocumentType } from '@utils/validators/documentTypes.validator';

const router = express.Router();

router.post(
  '/add',
  authenticateUser,
  authorizeRoles('PLANNER', 'DEVELOPER'),
  validateNewDocumentType,
  handleValidationErrors,
  addDocumentTypeController,
);

router.get('/',
  handleValidationErrors,
  getAllDocumentTypesController); //Get All DocumentTypes

export const documentTypesRoutes = router;