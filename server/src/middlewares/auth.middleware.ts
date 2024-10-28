import { Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { CustomRequest } from '@interfaces/customRequest.interface';

const secretKey = process.env.JWT_SECRET || 'your-secret-key';
if (!secretKey) {
    throw new Error('JWT_SECRET is not defined');
}

export const authenticateUser = (req: CustomRequest, res: Response, next: NextFunction): void => {
    const token = req.cookies?.['auth-token'];

    if (!token) {
        res.status(401).json({ message: 'Access denied. No token provided.' });
        return;
    }

    try {
        const decoded = jwt.verify(token, secretKey) as { id: string } & JwtPayload;
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ message: 'Invalid token.' });
    }
};