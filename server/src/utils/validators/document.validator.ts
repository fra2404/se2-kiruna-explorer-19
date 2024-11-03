import { body, param } from 'express-validator';
import { IConnection } from '@interfaces/document.interface';

export const validateAddDocument = [
  body('title')
    .notEmpty().withMessage('Title is required')
    .isString().withMessage('Title must be a string'),
  body('stakeholders')
    .notEmpty().withMessage('Stakeholders is required')
    .isString().withMessage('Stakeholders must be a string'),
  body('scale')
    .notEmpty().withMessage('Scale is required')
    .isString().withMessage('Scale must be a string'),
  body('type').notEmpty().withMessage('Type is required')
    .isIn(['AGREEMENT', 'CONFLICT', 'CONSULTATION', 'DESIGN_DOC', 'INFORMATIVE_DOC', 'MATERIAL_EFFECTS', 'PRESCRIPTIVE_DOC', 'TECHNICAL_DOC']).withMessage('Type is invalid'),
  body('connections')
    .optional()
    .isArray().withMessage('Connections must be an array of connections')
    .custom((connections) => {
      connections.forEach((connection: IConnection) => {
        // Validate connection document ID
        if (!connection.document) {
          throw new Error('Connection must have a document ID.');
        }
        // Validate connection type
        if (!connection.type || !['LINK1', 'LINK2', 'LINK3'].includes(connection.type)) {
          throw new Error('Connection type is invalid.');
        }
      });
      return true;
    }),
  body('language')
    .optional()
    .isString().withMessage('Language must be a string'),
  body('summary')
    .optional()
    .isString().withMessage('Summary must be a string'),
  body('date')
    .notEmpty().withMessage('Date is required')
    .matches(/^\d{2}-\d{2}-\d{4}$/).withMessage('Date must be in the format dd-mm-yyyy')
    .custom((value) => {
      const [day, month, year] = value.split('-').map(Number);
      const isValidDate = (d: number, m: number, y: number) => {
        const date = new Date(y, m - 1, d);
        return (
          date.getFullYear() === y &&
          date.getMonth() === m - 1 &&
          date.getDate() === d
        );
      };
      if (!isValidDate(day, month, year)) {
        throw new Error('Invalid date');
      }
      return true;
    }),  
  body('coordinates')
    .optional()
    .isMongoId().withMessage('Coordinates must be a valid MongoDB ObjectId')  
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
    .notEmpty().withMessage('Title is required')
    .isString().withMessage('Title must be a string'),
  body('stakeholders')
    .notEmpty().withMessage('Stakeholders is required')
    .isString().withMessage('Stakeholders must be a string'),
  body('scale')
    .notEmpty().withMessage('Scale is required')
    .isString().withMessage('Scale must be a string'),
  body('type').notEmpty().withMessage('Type is required')
    .isIn(['AGREEMENT', 'CONFLICT', 'CONSULTATION', 'DESIGN_DOC', 'INFORMATIVE_DOC', 'MATERIAL_EFFECTS', 'PRESCRIPTIVE_DOC', 'TECHNICAL_DOC']).withMessage('Type is invalid'),
  body('connections')
    .optional()
    .isArray().withMessage('Connections must be an array of connections')
    .custom((connections) => {
      connections.forEach((connection: IConnection) => {
        // Validate connection document ID
        if (!connection.document) {
          throw new Error('Connection must have a document ID.');
        }
        // Validate connection type
        if (!connection.type || !['LINK1', 'LINK2', 'LINK3'].includes(connection.type)) {
          throw new Error('Connection type is invalid.');
        }
      });
      return true;
    }),
  body('language')
    .optional()
    .isString().withMessage('Language must be a string'),
  body('summary')
    .notEmpty().withMessage('Summary is required')
    .isString().withMessage('Summary must be a string'),
  body('date')
    .notEmpty().withMessage('Date is required')
    .matches(/^\d{2}-\d{2}-\d{4}$/).withMessage('Date must be in the format dd-mm-yyyy')
    .custom((value) => {
      const [day, month, year] = value.split('-').map(Number);
      const isValidDate = (d: number, m: number, y: number) => {
        const date = new Date(y, m - 1, d);
        return (
          date.getFullYear() === y &&
          date.getMonth() === m - 1 &&
          date.getDate() === d
        );
      };
      if (!isValidDate(day, month, year)) {
        throw new Error('Invalid date');
      }
      return true;
    }),  
  body('coordinates')
    .optional()
    .isMongoId().withMessage('Coordinates must be a valid MongoDB ObjectId')  
];