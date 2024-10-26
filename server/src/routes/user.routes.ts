import { createUser, getUsers } from '@controllers/user.controllers';
import { authenticateUser } from '@middlewares/auth.middleware';
import { handleValidationErrors } from '@middlewares/validation.middleware';
import { validateUser } from '@utils/validators/user.validator';
import express from 'express';

const router = express.Router();

router.get('/users', authenticateUser, getUsers);
router.post('/users', validateUser, handleValidationErrors, createUser);

export default router;