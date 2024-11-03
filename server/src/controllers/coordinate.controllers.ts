import { Request, Response, NextFunction } from 'express';
import { addCoordinateService, getAllCoordinates } from '@services/coordinate.service';
import { CustomError } from '@utils/customError';

export const addCoordinate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const newCoordinate = await addCoordinateService(req.body);
        res.status(201).json({ message: 'Coordinate added successfully', coordinate: newCoordinate });
    } catch (error) {
        next(new CustomError('Internal Server Error', 500));
    }
};

export const getAllCoordinatesController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const coordinates = await getAllCoordinates();
        res.status(200).json(coordinates);
    } catch (error) {
        next(error);
    }
};