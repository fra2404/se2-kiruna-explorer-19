import { addDocumentController, getAllDocumentsController, getDocumentByIdController, updateDocumentController } from '@controllers/document.controllers';
import {
  validateAddDocument,
  validateDocumentId,
  validateUpdateDocument
} from '@utils/validators/document.validator';
import { handleValidationErrors } from '@middlewares/validation.middleware';

import express from 'express';
import { authenticateUser } from '@middlewares/auth.middleware';
import { authorizeRoles } from '@middlewares/role.middleware';

const router = express.Router();

router.post('/add', authenticateUser, authorizeRoles('PLANNER', 'DEVELOPER'), validateAddDocument, handleValidationErrors, addDocumentController); //Add Document
router.get('/', authenticateUser, getAllDocumentsController); //Get All Documents
router.get('/:id', authenticateUser, authorizeRoles('PLANNER', 'DEVELOPER'), validateDocumentId, getDocumentByIdController); // Get Document by ID
router.put('/:id', authenticateUser, authorizeRoles('PLANNER', 'DEVELOPER'), validateDocumentId, validateUpdateDocument, handleValidationErrors, updateDocumentController);

export const documentRoutes = router;
