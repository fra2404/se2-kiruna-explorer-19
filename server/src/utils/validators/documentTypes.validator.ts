
import { body } from 'express-validator';
import DocumentType from '@schemas/documentType.schema';

export const validateNewDocumentType = [
  body('newDocumentType')
    .custom(async (value, { req }) => {
      const type = req.body.type;


      if (!value || value.trim() === '') {   // If 'type' is 'New', 'newDocumentType' cannotbe  empty.
        throw new Error('New document type cannot be empty when "New" is selected.');
      }
      //check new document type not exists in DB
      const existingDocumentType = await DocumentType.findOne({ type: { $regex: new RegExp(`^${value.trim()}$`, 'i') }, });
      if (existingDocumentType) {
        throw new Error('The document type already exists.');
      }
      return true;
    }),
];
