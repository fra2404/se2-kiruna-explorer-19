import {
<<<<<<< HEAD
    addDocument,
    getDocuments
  } from '@controllers/document.controllers';
import {validateAddDocument} from '@utils/validators/document.validator';
=======
  addDocument
} from '@controllers/document.controllers';
import { validateAddDocument } from '@utils/validators/document.validator';
>>>>>>> e3d430b6c115e751560d6a2d092ff6c440dd79b5
import { handleValidationErrors } from '@middlewares/validation.middleware';

import express from 'express';
import { authenticateUser } from '@middlewares/auth.middleware';
import { authorizeRoles } from '@middlewares/role.middleware';

const router = express.Router();

router.post('/add', authenticateUser, authorizeRoles('PLANNER', 'DEVELOPER'), validateAddDocument, handleValidationErrors, addDocument); //Add Document
router.get('/', authenticateUser, authorizeRoles('PLANNER', 'DEVELOPER'), getDocuments); //Get All Documents


export const documentRoutes = router;
