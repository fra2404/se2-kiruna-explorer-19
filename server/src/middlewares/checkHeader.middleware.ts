import { Request, Response, NextFunction } from 'express';

const checkHeader = (req: Request, res: Response, next: NextFunction): void => {
  const expectedHeaderValue = process.env.API_KEY ?? 'my-api-key'; // An environmental variable is used for the expected value
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
