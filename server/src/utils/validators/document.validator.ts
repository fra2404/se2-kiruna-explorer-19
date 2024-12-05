import { body, param } from 'express-validator';
import { IConnection } from '@interfaces/document.interface';
import mongoose from 'mongoose';
import { ScaleTypeEnum } from '@utils/enums/scale-type-enum';
import { StakeholderEnum } from '@utils/enums/stakeholder.enum';


export const validateAddDocument = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isString()
    .withMessage('Title must be a string'),
  body('stakeholders')
    .notEmpty()
    .withMessage('Stakeholders is required')
    .isArray()
    .withMessage('Stakeholders must be an array')
    .custom((value) => {
      return validateStakeholderEmptiness(value);
    }
    )
    .custom((value) => {
      return validateStakeholderContent(value);
    }),
  body('scale')
    .notEmpty()
    .withMessage('Scale is required')
    .isString()
    .withMessage('Scale must be a string')
    .isIn(Object.values(ScaleTypeEnum))
    .withMessage('Scale is invalid')
    .custom((value, { req }) => validateScale(value, req.body.architecturalScale)),
  //**********************************/

  body('type')
    .notEmpty()
    .withMessage('Type is required')
    .isIn([
      'AGREEMENT',
      'CONFLICT',
      'CONSULTATION',
      'DESIGN_DOC',
      'INFORMATIVE_DOC',
      'MATERIAL_EFFECTS',
      'PRESCRIPTIVE_DOC',
      'TECHNICAL_DOC',
    ])
    .withMessage('Type is invalid'),
  body('connections')
    .optional()
    .isArray()
    .withMessage('Connections must be an array of connections')
    .custom((connections) => {
      connections.forEach((connection: IConnection) => {
        // Validate connection document ID
        if (!connection.document) {
          throw new Error('Connection must have a document ID.');
        }
        if (!mongoose.Types.ObjectId.isValid(connection.document.toString())) {
          throw new Error(
            'Connection document ID must be a valid MongoDB ObjectId.',
          );
        }
        // Validate connection type
        if (
          !connection.type ||
          !['DIRECT', 'COLLATERAL', 'PROJECTION', 'UPDATE'].includes(
            connection.type,
          )
        ) {
          throw new Error('Connection type is invalid.');
        }
      });
      return true;
    }),
  body('language')
    .optional()
    .isString()
    .withMessage('Language must be a string'),
  body('summary').optional().isString().withMessage('Summary must be a string'),
  body('date')
    .notEmpty()
    .withMessage('Date is required')
    .matches(/^\d{4}(-\d{2})?(-\d{2})?$/)
    .withMessage('Date must be in the format yyyy, yyyy-mm, or yyyy-mm-dd')
    .custom((value) => {
      return validateDate(value);
    }),
  body('coordinates')
    .optional()
    .isMongoId()
    .withMessage('Coordinates must be a valid MongoDB ObjectId'),
  body('media')
    .optional()
    .isMongoId()
    .withMessage('Media must be a valid MongoDB ObjectId')
    .isArray()
    .withMessage('Media must be an array of MediaId'),
];

export const validateDocumentId = [
  param('id').isMongoId().withMessage('Invalid document ID format'),
];

export const validateDocumentType = [
  param('type')
    .trim()
    .toUpperCase()
    .isIn([
      'AGREEMENT',
      'CONFLICT',
      'CONSULTATION',
      'DESIGN_DOC',
      'INFORMATIVE_DOC',
      'MATERIAL_EFFECTS',
      'PRESCRIPTIVE_DOC',
      'TECHNICAL_DOC',
    ])
    .withMessage('Type is invalid'),
];

export const validateUpdateDocument = [
  body('title').optional().isString().withMessage('Title must be a string'),
  body('stakeholders')
    .optional()
    .isArray()
    .withMessage('Stakeholders must be an array')
    .custom((value) => {
      return validateStakeholderEmptiness(value);
    }
    )
    .custom((value) => {
      return validateStakeholderContent(value);
    }),
  body('scale')
    .optional()
    .isString()
    .withMessage('Scale must be a string')
    .isIn(Object.values(ScaleTypeEnum))
    .withMessage('Scale is invalid')
    .custom((value, { req }) => validateScale(value, req.body.architecturalScale)),
  body('type')
    .optional()
    .isIn([
      'AGREEMENT',
      'CONFLICT',
      'CONSULTATION',
      'DESIGN_DOC',
      'INFORMATIVE_DOC',
      'MATERIAL_EFFECTS',
      'PRESCRIPTIVE_DOC',
      'TECHNICAL_DOC',
    ])
    .withMessage('Type is invalid'),
  body('connections')
    .optional()
    .isArray()
    .withMessage('Connections must be an array of connections')
    .custom((connections) => {
      connections.forEach((connection: IConnection) => {
        // Validate connection document ID
        if (!connection.document) {
          throw new Error('Connection must have a document ID.');
        }
        if (!mongoose.Types.ObjectId.isValid(connection.document.toString())) {
          throw new Error(
            'Connection document ID must be a valid MongoDB ObjectId.',
          );
        }
        // Validate connection type
        if (
          !connection.type ||
          !['DIRECT', 'COLLATERAL', 'PROJECTION', 'UPDATE'].includes(
            connection.type,
          )
        ) {
          throw new Error('Connection type is invalid.');
        }
      });
      return true;
    }),
  body('language')
    .optional()
    .isString()
    .withMessage('Language must be a string'),
  body('summary').optional().isString().withMessage('Summary must be a string'),
  body('date')
    .optional()
    .matches(/^\d{4}(-\d{2})?(-\d{2})?$/)
    .withMessage('Date must be in the format yyyy, yyyy-mm, or yyyy-mm-dd')
    .custom((value) => {
      return validateDate(value);
    }),
  body('coordinates')
    .optional()
    .isMongoId()
    .withMessage('Coordinates must be a valid MongoDB ObjectId'),
  body('media')
    .optional()
    .isMongoId()
    .withMessage('Media must be a valid MongoDB ObjectId')
    .isArray()
    .withMessage('Media must be an array of MediaId'),
];

export const validateSearchDocument = [
  body()
    .custom((body) => {
      const allowedKeys = ['scale', 'stakeholders', 'type', 'architecturalScale', 'date', 'language', 'coordinates'];
      const invalidKeys = Object.keys(body).filter(
        (key) => !allowedKeys.includes(key)
      );

      if (invalidKeys.length > 0) {
        throw new Error(`Invalid keys provided: ${invalidKeys.join(', ')}`);
      }
      return true;
    }),


  body('stakeholders')
    .optional()
    .isArray()
    .withMessage('Stakeholders must be an array')
    //   .custom((value) => {
    //     return validateStakeholderEmptiness(value);
    //  })  //I do not know if needed or I should consider empty array like not filtering by stakeholder?!
    .custom((value) => {
      return validateStakeholderContent(value);
    }),
  body('date')
    .optional()
    .custom((value) => {
      return validateDate(value);
    }),
  body('scale')
    .optional()
    .isString()
    .withMessage('Scale must be a string')
    .isIn(Object.values(ScaleTypeEnum))
    .withMessage('Scale is invalid'),
  body('architecturalScale')
    .optional()
    .isString()
    .withMessage('Architectural Scale must be a string')
    .custom((value) => {
      if (!/^1:\d+$/.test(value)) {
        throw new Error('Architectural Scale must be in the format 1:number');
      }
      return true;
    }),
  body('coordinates')
    .optional()
    .isMongoId()
    .withMessage('Coordinates must be a valid MongoDB ObjectId'),
]


const validateScale = (scale: ScaleTypeEnum, architecturalScale?: string) => {
  if (scale === ScaleTypeEnum.Architectural) {
    if (!architecturalScale || !/^1:\d+$/.test(architecturalScale)) {
      throw new Error('Architectural Scale must be in the 1:number format');
    }
  } else {
    if ([ScaleTypeEnum.BlueprintMaterialEffects, ScaleTypeEnum.Text, ScaleTypeEnum.Concept].includes(scale)) {
      if (architecturalScale) {
        throw new Error('Architectural Scale must be empty when scale is a string');
      }
    }
    //else if (![ScaleTypeEnum.BlueprintMaterialEffects, ScaleTypeEnum.Text, ScaleTypeEnum.Concept].includes(scale)) {
    //   throw new Error(`Invalid scale: ${scale}`);
    // }
  }
  return true;
};


const validateDate = (value: string) => {
  const parts = value.split('-').map(Number);
  const [year, month, day] = parts;

  if (!year || year < 1000 || year > 9999) {
    throw new Error('Year must be a 4-digit number');
  }

  if (month && (month < 1 || month > 12)) {
    throw new Error('Month must be between 01 and 12');
  }

  if (day) {
    const date = new Date(year, month - 1, day); // check if complete date is valid
    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
      throw new Error('Date is invalid');
    }
  }

  const inputDate = new Date(year, month ? month - 1 : 0, day || 1);
  const today = new Date();
  today.setHours(0, 0, 0, 0);  // Set to midnight to compare only date part

  if (inputDate.getTime() > today.getTime()) {
    throw new Error('Date cannot be in the future');
  }

  return true;
};


const validateStakeholderContent = (stakeholders: string[]) => {
  const validStakeholders: string[] = Object.values(StakeholderEnum)
  stakeholders.forEach((stakeholder) => {
    if (!validStakeholders.includes(stakeholder)) {
      throw new Error(`Invalid stakeholder: ${stakeholder}`);
    }
  });
  return true;
}

const validateStakeholderEmptiness = (stakeholders: string[]) => {
  if (Array.isArray(stakeholders) && stakeholders.length === 0) {
    throw new Error('Stakeholders cannot be an empty array');
  }
  return true;
}
