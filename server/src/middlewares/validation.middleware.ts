import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // console.log('Validation errors:', errors.array());
    res.status(400).json({ errors: errors.array() });
  } else {
    next();
  }
};
