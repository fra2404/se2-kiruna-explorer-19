import { 
  addDocumentController, 
  getAllDocumentsController, 
  getDocumentByIdController, 
  updateDocumentController,
  deleteDocumentController,
  //getTypesController,
  getDocumentsByTypeController } from '@controllers/document.controllers';
//import { addDocumentController, deleteDocumentController, getAllDocumentsController, getDocumentByIdController, updateDocumentController } from '@controllers/document.controllers';
import {
  validateAddDocument,
  validateDocumentId,
  validateDocumentType,
  validateUpdateDocument } from '@utils/validators/document.validator';
import { handleValidationErrors } from '@middlewares/validation.middleware';

import express from 'express';
import { authenticateUser } from '@middlewares/auth.middleware';
import { authorizeRoles } from '@middlewares/role.middleware';

const router = express.Router();

router.post('/create', authenticateUser, authorizeRoles('PLANNER', 'DEVELOPER'), validateAddDocument, handleValidationErrors, addDocumentController); //Add Document
router.get('/', authenticateUser, getAllDocumentsController); //Get All Documents
router.get('/:id', authenticateUser, authorizeRoles('PLANNER', 'DEVELOPER'), validateDocumentId, getDocumentByIdController); // Get Document by ID
router.put('/:id', authenticateUser, authorizeRoles('PLANNER', 'DEVELOPER'), validateDocumentId, validateUpdateDocument, handleValidationErrors, updateDocumentController);
//router.get('/types', authenticateUser, authorizeRoles('PLANNER', 'DEVELOPER'), getTypesController); //Get All Types
router.get('/types/:type', authenticateUser, authorizeRoles('PLANNER', 'DEVELOPER'), validateDocumentType, handleValidationErrors, getDocumentsByTypeController); //Get Document based On Type
router.delete('/', deleteDocumentController);

export const documentRoutes = router;
