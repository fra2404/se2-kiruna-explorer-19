import { IGraphData } from "@interfaces/graph.return.interface";
import { getGraphDatas } from "@services/graph.service";
import { NextFunction, Request, Response } from "express";

/**
 * @swagger
 * /api/graph:
 *   get:
 *     summary: Get graph construction data
 *     description: Retrieve graph construction data including minYear, maxYear, and infoYear.
 *     tags: [Graph]
 *     responses:
 *       200:
 *         description: Successfully retrieved graph construction data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 minYear:
 *                   type: string
 *                   example: "2010"
 *                 maxYear:
 *                   type: string
 *                   example: "2020"
 *                 infoYear:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       year:
 *                         type: string
 *                         example: "2010"
 *                       types:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             scale:
 *                               type: string
 *                               example: "scale1"
 *                             qty:
 *                               type: number
 *                               example: 5
 *       500:
 *         description: Internal server error
 */
export const getGraphConstruction = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const documents = await getGraphDatas();
        res.status(200).json(documents);
    } catch (error) {
        next(error); // Pass the error to the error handler middleware
    }
};