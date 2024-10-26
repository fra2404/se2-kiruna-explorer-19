import { Request, Response } from 'express';
import User from '../schemas/userSchema';
import { IUser } from '../interfaces/IUser';

export const getUsers = async (req: Request, res: Response) => {
    const users: IUser[] = await User.find();
    res.json(users);
};

export const createUser = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    const newUser = new User({ name, email, password });
    await newUser.save();
    res.status(201).json(newUser);
};