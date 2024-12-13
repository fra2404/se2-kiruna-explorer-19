import { body, param } from 'express-validator';
import { IConnection } from '@interfaces/document.interface';
import mongoose from 'mongoose';
import { ScaleTypeEnum } from '@utils/enums/scale-type-enum';
import Stakeholder from '@schemas/stakeholder.schema';
import DocumentType from '@schemas/documentType.schema';



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
    .custom(async (value) => {
      await validateStakeholderContent(value);
      return true;
    })
    .custom(async (value) => {
      await validateStakeholderRepetition(value);
      return true;
    }),
  body('scale')
    .notEmpty()
    .withMessage('Scale is required')
    .isString()
    .withMessage('Scale must be a string')
    .isIn(Object.values(ScaleTypeEnum))
    .withMessage('Scale is invalid')
    .custom((value, { req }) => validateScale(value, req.body.architecturalScale)),
  body('type')
    .notEmpty()
    .withMessage('Type is required')
    .isString()
    .withMessage('Type must be a string')
    .custom(async (value) => {
      await validateDocumentTypeContent(value);
      return true;
    }),
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
    .custom(async (value) => {
      await validateDocumentTypeContentForSearch(value);
      return true;
    }),
];

export const validateUpdateDocument = [
  body('title').optional().isString().withMessage('Title must be a string'),
  body('stakeholders')
    .optional()
    .isArray()
    .withMessage('Stakeholders must be an array of ObjectID')
    .custom((value) => {
      return validateStakeholderEmptiness(value);
    }
    )
    .custom((value) => {
      return validateStakeholderContent(value);
    })
    .custom((value) => {
      return validateStakeholderRepetition(value);
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
    .isString()
    .withMessage('Type must be a string')
    .custom(async (value) => {
      await validateDocumentTypeContent(value);
      return true;
    }),
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

  body('type')
    .optional()
    .isString()
    .withMessage('Type must be a string')
    .custom(async (value) => {
      await validateDocumentTypeContentForSearch(value);
      return true;
    }),

  body('stakeholders')
    .optional()
    .isArray()
    .withMessage('Stakeholders must be an array')
    .custom((value) => {
      return validateStakeholderContentForSearch(value);
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



//--------------------------Stakeholder------------------------------
const validateStakeholderContent = async (stakeholders: mongoose.Types.ObjectId[]) => {
  for (const stakeholderId of stakeholders) {
    // Check if the ObjectId is valid
    if (!mongoose.Types.ObjectId.isValid(stakeholderId)) {
      throw new Error('Stakeholder(s) must be valid MongoDB ObjectId');
    }
    // Check if the stakeholder exists in DB
    const stakeholder = await Stakeholder.findById(stakeholderId);
    if (!stakeholder) {
      throw new Error(`Stakeholder with ID ${stakeholderId} not found`);
    }
  }
  return true;
};


const validateStakeholderContentForSearch = async (stakeholders: string[]) => {
  for (const stakeholderType of stakeholders) {
    // Check if the stakeholder exists
    const stakeholder = await Stakeholder.findOne({ type: stakeholderType });
    if (!stakeholder) {
      throw new Error(`Stakeholder ${stakeholderType} not found`);
    }
  }
  return true;
};


const validateStakeholderEmptiness = (stakeholders: mongoose.Types.ObjectId[]) => {
  if (Array.isArray(stakeholders) && stakeholders.length === 0) {
    throw new Error('Stakeholders cannot be an empty array');
  }
  return true;
};


  const validateStakeholderRepetition = async (stakeholders: mongoose.Types.ObjectId[]) => {
    for (let i = 0; i < stakeholders.length; i++) {
      if (stakeholders.indexOf(stakeholders[i]) !== i) {
        throw new Error('Stakeholders cannot be duplicate.');
      }
    }
    return true;
  }; 


//--------------------------Document Type------------------------------
  const validateDocumentTypeContent = async (documentTypes: mongoose.Types.ObjectId) => {
        // Check if the ObjectId is valid
      if (!mongoose.Types.ObjectId.isValid(documentTypes)) {
        throw new Error('DocumentType must be valid MongoDB ObjectId');
      }
      // Check if the documentType exists in DB
      const type = await DocumentType.findById(documentTypes);
      if (!type) {
        throw new Error(`Document Type with ID ${documentTypes} not found`);
      }
    return true;
  };
  

  const validateDocumentTypeContentForSearch = async (documentType: string) => {
    // Check if the type exists in DB
  const type = await DocumentType.findOne({ type: { $regex: new RegExp('^' + documentType + '$', 'i') } });
  if (!type) {
    throw new Error(`Document Type with name ${documentType} not found`);
  }
  return true;
};