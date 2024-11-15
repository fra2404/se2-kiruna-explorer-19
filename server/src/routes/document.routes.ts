import {
  addDocumentController,
  getAllDocumentsController,
  getDocumentByIdController,
  updateDocumentController,
  deleteDocumentController,
  getDocumentTypesController,
  getDocumentsByTypeController,
} from '@controllers/document.controllers';

import {
  validateAddDocument,
  validateDocumentId,
  validateDocumentType,
  validateUpdateDocument,
} from '@utils/validators/document.validator';
import { handleValidationErrors } from '@middlewares/validation.middleware';

import express from 'express';
import { authenticateUser } from '@middlewares/auth.middleware';
import { authorizeRoles } from '@middlewares/role.middleware';

const router = express.Router();

router.post(
  '/create',
  authenticateUser,
  authorizeRoles('PLANNER', 'DEVELOPER'),
  validateAddDocument,
  handleValidationErrors,
  addDocumentController,
); //Add Document

router.get('/', getAllDocumentsController); //Get All Documents

router.get(
  '/:id',
  authenticateUser,
  validateDocumentId,
  getDocumentByIdController,
); // Get Document by ID

router.put(
  '/:id',
  authenticateUser,
  authorizeRoles('PLANNER', 'DEVELOPER'),
  validateDocumentId,
  validateUpdateDocument,
  handleValidationErrors,
  updateDocumentController,
);

router.get(
  '/types/all',
  getDocumentTypesController); //Get All Types


router.get(
  '/types/:type',
  validateDocumentType,
  handleValidationErrors,
  getDocumentsByTypeController,
); //Get Document based On Type

/* istanbul ignore next */
router.delete('/', deleteDocumentController);

export const documentRoutes = router;
