import { Request, Response, NextFunction } from 'express';

interface CustomError extends Error {
    status?: number;
    errors?: any[];
}

export const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction): void => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        errors: err.errors || [],
    });
};