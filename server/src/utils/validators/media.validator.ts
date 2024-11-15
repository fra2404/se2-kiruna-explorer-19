import { body, param } from 'express-validator';

export const validateUploadedMedia = [
    body('filename')
      .isString()
      .withMessage('Filename must be a string.')
      .notEmpty().withMessage('Filename is required.'),
  
    body('size')
      .isNumeric()
      .withMessage('Size must be a number.')
      .custom((value) => value > 0)
      .withMessage('Size must be greater than 0.'),
  
    body('mimetype')
      .isString()
      .withMessage('MIME type must be a string.')
      .notEmpty().withMessage('MIME type is required.')
      .isIn(['image/jpeg','image/png','image/gif','application/pdf','text/plain']).withMessage('MimeType in invalid'),
  ];
  
  export const validateUpdateMedia = [
    body('mediaId')
    .notEmpty()
    .withMessage('mediaId is required.')
    .isMongoId().withMessage('Invalid media ID format'),

    body('page')
    .optional()
    .isNumeric()
    .withMessage('page must be a number.')
  ];
  
  export const validateMediaId = [
    param('id').isMongoId().withMessage('Invalid meida ID format'),
  ];