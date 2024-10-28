import { Response, NextFunction } from 'express';
import { CustomRequest } from '@interfaces/customRequest.interface';
import { CustomError } from '@utils/customError';

export const authorizeRoles = (...roles: string[]) => {
    return (req: CustomRequest, res: Response, next: NextFunction): void => {
        if (!req.user || !roles.includes(req.user.role)) {
            throw new CustomError('Access denied. You do not have the required role.', 403);
        }
        next();
    };
};