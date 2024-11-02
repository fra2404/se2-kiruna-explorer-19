import {
    addDocument,
    getDocuments,
    getDocument,
    updateDocument
  } from '@controllers/document.controllers';
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

router.post('/add', authenticateUser, authorizeRoles('PLANNER', 'DEVELOPER'), validateAddDocument, handleValidationErrors, addDocument); //Add Document
router.get('/', authenticateUser, authorizeRoles('PLANNER', 'DEVELOPER'), getDocuments); //Get All Documents
router.get('/:id', authenticateUser, authorizeRoles('PLANNER', 'DEVELOPER'), validateDocumentId, getDocument); // Get Document by ID
router.put('/:id', authenticateUser, authorizeRoles('PLANNER', 'DEVELOPER'), validateUpdateDocument, handleValidationErrors, updateDocument);

export const documentRoutes = router;
