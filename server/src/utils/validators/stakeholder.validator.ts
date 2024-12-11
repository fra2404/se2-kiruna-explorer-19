
import { body, param } from 'express-validator';

export const validateStakeholder = [
  body('type')
    .isString()
    .withMessage('StakeholderType must be a string.')
    .notEmpty()
    .withMessage('StakeholderType is required.'),
];
