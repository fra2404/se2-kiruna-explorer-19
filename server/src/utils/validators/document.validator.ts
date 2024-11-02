import { body, param } from 'express-validator';

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
    .isIn(['AGREEMENT', 'CONFLICT', 'CONSULTATION', 'DESIGN_DOC', 'INFORMATIVE_DOC', 'MAETRIAL_EFFECTS', 'PRESCRIPTIVE_DOC', 'TECHNICAL_DOC']).withMessage('Type is invalid'),
  body('connections')
    .optional()
    .isArray().withMessage('Connections must be an array of connections'),
  body('language') 
    .optional()
    .isString().withMessage('Language must be a string')
];

export const validateDocumentId = [
  param('id')
      .isMongoId()
      .withMessage('Invalid document ID format')
];

export const validateUpdateDocument = [
  param('id')
    .isMongoId()
    .withMessage('Invalid document ID format'),
  body('title')
    .optional()
    .isString().withMessage('Title must be a string'),
  body('stakeholders')
    .optional()
    .isString().withMessage('Stakeholders must be a string'),
  body('scale')
    .optional()
    .isString().withMessage('Scale must be a string'),
  body('type')
    .optional()
    .isIn(['DETAILED_PLAN', 'COMPETITION', 'AGREEMENT', 'DEFORMATION_FORECAST']).withMessage('Type is invalid'),
  body('connections')
    .optional()
    .isArray().withMessage('Connections must be an array of connections'),
  body('language')
    .optional()
    .isString().withMessage('Language must be a string'),
  body('summary')
    .optional()
    .isString().withMessage('Summary must be a string')
];