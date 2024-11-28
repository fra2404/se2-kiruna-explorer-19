import { getGraphDatas } from "@services/graph.service";
import { NextFunction, Request, Response } from "express";

export const getGraphConstruction = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const documents: any[] = await getGraphDatas();
        res.status(200).json(documents);
    } catch (error) {
        next(error); // Pass the error to the error handler middleware
    }
};