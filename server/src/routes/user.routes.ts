import {
  createUser,
  getUsers,
  getMe,
  login,
} from '@controllers/user.controllers';
import { authenticateUser } from '@middlewares/auth.middleware';
import { authorizeRoles } from '@middlewares/role.middleware';
import { handleValidationErrors } from '@middlewares/validation.middleware';
import {
  validateUserLogin,
  validateUserSignUp,
} from '@utils/validators/user.validator';
import express from 'express';

const router = express.Router();

router.get('/', authenticateUser, authorizeRoles('PLANNER', 'DEVELOPER'), getUsers);
router.post('/signup', validateUserSignUp, handleValidationErrors, createUser);
router.post('/login', validateUserLogin, handleValidationErrors, login);
router.get('/me', authenticateUser, getMe);

export const userRoutes = router;