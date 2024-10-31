import { body } from 'express-validator';

export const validateAddDocument = [
  body('title')
    .notEmpty().withMessage('Title is required')
    .isString().withMessage('Title must be a string'),
  body('stakeholders')
    .optional()
    .isString().withMessage('Stakeholders must be a string'),
  body('scale')
    .optional()
    .isString().withMessage('Scale must be a string'),
  body('type').notEmpty().withMessage('Type is required')
    .isIn(['DETAILED_PLAN', 'COMPETITION', 'AGREEMENT', 'DEFORMATION_FORECAST']).withMessage('Type is invalid'), // Adjust types
  body('connections').optional().isArray().withMessage('Connections must be an array of connections'),
  body('language').optional().isString().withMessage('Language must be a string')
];
