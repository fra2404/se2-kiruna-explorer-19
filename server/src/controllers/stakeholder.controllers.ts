import { Request, Response, NextFunction } from 'express';
import {
    addingStakeholder,
    getAllStakeholders,
} from '../services/stakeholder.service';
import { IStakeholder } from '@interfaces/stakeholder.interface';



/**
 * @swagger
 * /api/stakeholders/create:
 *   post:
 *     summary: Add a new stakeholder
 *     tags: [Stakeholders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Stakeholder'
 *     responses:
 *       201:
 *         description: Stakeholder added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 stakeholder:
 *                   $ref: '#/components/schemas/Stakeholder'
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Internal server error
 */

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


/**
 * @swagger
 * /api/stakeholders:
 *   get:
 *     summary: Get all stakeholders
 *     tags: [Stakeholders]
 *     responses:
 *       200:
 *         description: List of all stakeholders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Stakeholder'
 *       404:
 *         description: No stakeholders found
 *       500:
 *         description: Internal server error
 */

  export const getAllStakeholdersController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const stakeholders: IStakeholder[] = await getAllStakeholders();
      res.status(200).json(stakeholders);
    } catch (error) {
      next(error); // Pass the error to the error handler middleware
    }
  };
