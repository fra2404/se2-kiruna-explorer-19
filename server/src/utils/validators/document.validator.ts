import { body } from 'express-validator';

export const validateAddDocument = [
  body('title').notEmpty().withMessage('Title is required'),
  body('type').notEmpty().withMessage('Type is required')
    .isIn(['TYPE1', 'TYPE2', 'TYPE3']).withMessage('Type is invalid'), // Adjust types
  body('connections').optional().isArray().withMessage('Connections must be an array of connections'),
  body('language').optional().isString().withMessage('Language must be a string')
];