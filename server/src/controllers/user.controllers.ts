import { Request, Response, NextFunction } from 'express';
import User from '../schemas/user.schema';
import { IUser } from '../interfaces/user.interface';

export const getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const users: IUser[] = await User.find();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    const newUser = new User({ name, email, password });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};