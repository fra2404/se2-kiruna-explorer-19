import { Request, Response, NextFunction } from 'express';
import { addCoordinateService, deleteCoordinatesByNames, getAllCoordinates, getCoordinateById } from '@services/coordinate.service';
import { CustomError } from '@utils/customError';
import { PositionError } from '@utils/errors';

/**
 * @swagger
 * components:
 *   schemas:
 *     Coordinate:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The coordinate ID
 *         type:
 *           type: string
 *           description: The type of the coordinate (Point or Polygon)
 *           enum:
 *             - Point
 *             - Polygon
 *         coordinates:
 *           type: array
 *           items:
 *             type: number
 *           description: The coordinates (longitude and latitude for Point, array of arrays for Polygon)
 *         name:
 *           type: string
 *           description: The name of the coordinate
 */

/**
 * @swagger
 * tags:
 *   name: Coordinates
 *   description: Coordinate management
 */

/**
 * @swagger
 * /api/coordinates/create:
 *   post:
 *     summary: Create a new coordinate
 *     tags: [Coordinates]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Coordinate'
 *     responses:
 *       201:
 *         description: Coordinate added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 coordinate:
 *                   $ref: '#/components/schemas/Coordinate'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
export const addCoordinate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const newCoordinate = await addCoordinateService(req.body);
        res.status(201).json({ message: 'Coordinate added successfully', coordinate: newCoordinate });
    } catch (error) {
        next(new CustomError('Internal Server Error', 500));
    }
};

/**
 * @swagger
 * /api/coordinates:
 *   get:
 *     summary: Get all coordinates
 *     tags: [Coordinates]
 *     responses:
 *       200:
 *         description: List of all coordinates
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Coordinate'
 *       500:
 *         description: Internal server error
 */
export const getAllCoordinatesController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const coordinates = await getAllCoordinates();
        res.status(200).json(coordinates);
    } catch (error) {
        next(error);
    }
};

/**
 * @swagger
 * /api/coordinates/{id}:
 *   get:
 *     summary: Get a coordinate by ID
 *     tags: [Coordinates]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The coordinate ID
 *     responses:
 *       200:
 *         description: Coordinate found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Coordinate'
 *       404:
 *         description: Coordinate not found
 *       500:
 *         description: Internal server error
 */
export const getCoordinateByIdController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const coordinate = await getCoordinateById(id);
        if (!coordinate) {
            console.log('Coordinate not found');
            return next(new PositionError());
        }
        res.status(200).json(coordinate);
    } catch (error) {
        next(new CustomError('Internal Server Error', 500));
    }
};

export const deleteCoordinateController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const names = ["TestColosseo", "TestArea di Roma"];
        await deleteCoordinatesByNames(names);
        res.status(200).json({ message: 'Coordinates deleted successfully' });
    } catch (error) {
        next(new CustomError('Internal Server Error', 500));
    }
};