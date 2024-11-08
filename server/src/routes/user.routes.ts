import {
  createUser,
  getUsers,
  getMe,
  login,
  logout,
  deleteUser,
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

router.get(
  '/',
  authenticateUser,
  authorizeRoles('PLANNER', 'DEVELOPER'),
  getUsers,
);
router.post('/signup', validateUserSignUp, handleValidationErrors, createUser);
router.post('/login', validateUserLogin, handleValidationErrors, login);
router.post('/logout', authenticateUser, logout);
router.get('/me', authenticateUser, getMe);
router.delete('/', deleteUser);

export const userRoutes = router;
