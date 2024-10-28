import { Response, NextFunction } from 'express';
import { CustomRequest } from '@interfaces/customRequest.interface';
import { IUser } from '../interfaces/user.interface';
import { createNewUser, getAllUsers, getUserById, loginUser } from '@services/user.service';
import { CustomError } from '@utils/customError';

export const getUsers = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const users: IUser[] = await getAllUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userCreatedString = await createNewUser(req.body);

    res.status(201).json(userCreatedString);
  } catch (error) {
    next(error);
  }
};

export const login = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;
    const { user, token } = await loginUser(email, password);
    res.cookie('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000, // 1 hour
      path: '/'
    });
    res.json({ user, token });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new CustomError('User ID not found in token', 400);
    }
    const user = await getUserById(userId);
    if (!user) {
      throw new CustomError('User not found', 404);
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};