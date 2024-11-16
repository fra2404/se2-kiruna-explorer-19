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

    body('metadata.page')
    .custom((value) => {
      if (value && !Number.isInteger(Number(value))) {
        throw new Error('Page must be a number.');
      }
      return true;
    }),

    body('metadata.size')
    .notEmpty()
    .withMessage('Size is required')
    .isNumeric()
    .withMessage('Size must be a number.')
    .custom((value) => value > 0)
    .withMessage('Size must be greater than 0.'),
  ];
  
  export const validateMediaId = [
    param('id').isMongoId().withMessage('Invalid meida ID format'),
  ];