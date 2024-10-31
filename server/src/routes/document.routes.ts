import {
    addDocument,
    getDocuments
  } from '@controllers/document.controllers';
import {validateAddDocument} from '@utils/validators/document.validator';
import { handleValidationErrors } from '@middlewares/validation.middleware';

import express from 'express';
import { authenticateUser } from '@middlewares/auth.middleware';
import { authorizeRoles } from '@middlewares/role.middleware';

const router = express.Router();

router.post('/add', authenticateUser, authorizeRoles('PLANNER', 'DEVELOPER'), validateAddDocument, handleValidationErrors, addDocument); //Add Document
router.get('/', authenticateUser, authorizeRoles('PLANNER', 'DEVELOPER'), getDocuments); //Get All Documents


export const documentRoutes = router;
