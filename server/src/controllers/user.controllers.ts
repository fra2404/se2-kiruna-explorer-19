import { Response, NextFunction } from 'express';
import { CustomRequest } from '@interfaces/customRequest.interface';
import { IUser } from '../interfaces/user.interface';
import { createNewUser, getAllUsers, getUserById, loginUser } from '@services/user.service';
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
 *             - TIZIO1
 *             - TIZIO2
 *             - TIZIO3
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
 * /users:
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
export const getUsers = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const users: IUser[] = await getAllUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /users:
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
 *                   - TIZIO1
 *                   - TIZIO2
 *                   - TIZIO3
 *     responses:
 *       201:
 *         description: User created successfully
 *         
 */
export const createUser = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result: string = await createNewUser(req.body);

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /users/login:
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
export const login = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;
    const { token }: { token: string } = await loginUser(email, password);
    res.cookie('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600000, // 1 hour
      path: '/'
    });
    res.json({ token });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /users/me:
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
export const getMe = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new CustomError('User ID not found in token', 400);
    }
    const user: IUserResponse | null = await getUserById(userId);
    if (!user) {
      throw new CustomError('User not found', 404);
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};