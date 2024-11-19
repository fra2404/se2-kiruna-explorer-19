import { Request, Response, NextFunction } from 'express';

const checkHeader = (req: Request, res: Response, next: NextFunction): void => {
    const expectedHeaderValue = process.env.API_KEY || 'my-api-key'; // Usa una variabile d'ambiente per il valore atteso
    const headerValue = req.headers['x-api-key'];

    if (!headerValue) {
        res.status(400).json({ error: 'Missing x-api-key header' });
    } else if (headerValue !== expectedHeaderValue) {
        res.status(403).json({ error: 'Forbidden: Invalid header value' });
    } else {
        next();
    }
};

export default checkHeader;