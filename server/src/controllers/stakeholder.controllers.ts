import { Request, Response, NextFunction } from 'express';
import {
    addingStakeholder,
} from '../services/stakeholder.service';
import { IStakeholder } from '@interfaces/stakeholder.interface';

//Add Stakeholder
export const addStakeholderController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const newStakeholder = await addingStakeholder(req.body as IStakeholder);
      res.status(201).json(newStakeholder);
    } catch (error) {
      next(error); // Pass the error to the error handler middleware
    }
  };
