import { Response, NextFunction } from 'express';
import { CustomRequest } from '@interfaces/customRequest.interface';
import {
  createNewUser,
  deleteUserByEmail,
  getAllUsers,
  loginUser,
} from '@services/user.service';
import { CustomError } from '@utils/customError';
import { IUserResponse } from '@interfaces/user.return.interface';

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The user ID
 *         name:
 *           type: string
 *           description: The user's name
 *         email:
 *           type: string
 *           description: The user's email
 *         surname:
 *           type: string
 *           description: The user's surname
 *         phone:
 *           type: string
 *           description: The user's phone number
 *         role:
 *           type: string
 *           description: The user's role
 *           enum:
 *             - PLANNER
 *             - DEVELOPER
 *             - VISITOR
 *             - RESIDENT
 *     TokenResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           description: The JWT token
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: The error message
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export const getUsers = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const users: IUserResponse[] = await getAllUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/users/signup:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               surname:
 *                 type: string
 *               phone:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum:
 *                   - PLANNER
 *                   - DEVELOPER
 *                   - VISITOR
 *                   - RESIDENT
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export const createUser = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result: string = await createNewUser(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TokenResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export const login = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email, password } = req.body;
    const { token }: { token: string } = await loginUser(email, password);
    res.cookie('auth-token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      domain: 'se2-kiruna-explorer-19-fra2404s-projects.vercel.app',
      maxAge: 3600000, // 1 hour
      path: '/',
    });
    res.json({ token });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Get current user
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Current user information
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export const getMe = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      throw new CustomError('User not authenticated', 401);
    }

    const user: IUserResponse = {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      surname: req.user.surname,
      phone: req.user.phone,
      role: req.user.role,
    };

    res.json(user);
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/users/logout:
 *   post:
 *     summary: Logout a user
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: User logged out successfully
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export const logout = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    res.clearCookie('auth-token', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      domain: 'se2-kiruna-explorer-19-fra2404s-projects.vercel.app',
      path: '/',
    });
    res.json({ message: 'User logged out successfully' });
  } catch (error) {
    next(error);
  }
};

/* istanbul ignore next */
export const deleteUser = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result: string = await deleteUserByEmail('testuser@example.com');
    res.json(result);
  } catch (error) {
    next(error);
  }
};
