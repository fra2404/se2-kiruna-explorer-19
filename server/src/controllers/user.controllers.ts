import { Response, NextFunction } from 'express';
import { CustomRequest } from '@interfaces/customRequest.interface';
import { IUser } from '../interfaces/user.interface';
import {
  createNewUser,
  getAllUsers,
  getUserById,
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
 * /api/users:
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
 *
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
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
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
