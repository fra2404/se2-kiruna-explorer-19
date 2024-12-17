import DocumentType from '../schemas/documentType.schema';
import { CustomError } from '../utils/customError';
import { IDocumentType } from '../interfaces/documentType.interface';
import { DocumentTypeNotFoundError } from '../utils/errors';
import { ObjectId } from 'mongoose';
import { ObjectId as MongoObjectId } from 'mongodb';

//Add new documentType
export const addingDocumentType = async (
  DocumentTypeData: any,
): Promise<IDocumentType> => {
  try {
    const documentType = new DocumentType({
      type: DocumentTypeData.newDocumentType,
    });

    const newDocumentType = await documentType.save();
    return newDocumentType;
  } catch (error) {
    throw new CustomError('Internal Server Error', 500);
  }
};


// Get all documentTypes 
export const getAllDocumentTypes = async (): Promise<IDocumentType[]> => {
  const allDocumentTypes = await DocumentType.find().select('-createdAt -updatedAt -__v');

  // Not Found DocumentType
  if (allDocumentTypes.length === 0) {
    throw new DocumentTypeNotFoundError();
  }

  return allDocumentTypes;
};


// Get documentType by ID
export const getDocumentTypeById = async (
  documentTypeId: string,
): Promise<IDocumentType | null> => {
  try {
    const documentType = await DocumentType.findById(documentTypeId).select('-createdAt -updatedAt -__v');
    if (!documentType) {
      throw new Error('Document type not found');
    }
    return documentType.toObject();
  } catch (error) {
    // Handle error here if needed
    throw new CustomError('Internal Server Error', 500);
  }
};


export const fetchDocumentTypes = async (
  documentTypeId: ObjectId,
): Promise<IDocumentType | null> => {
  if (documentTypeId) {
    const documentType = await getDocumentTypeById(documentTypeId.toString());
    if (documentType) 
       return documentType;
}
  return null;
};


export const fetchDocumentTypesForSearch = async (
  documentTypeName: string,
): Promise<ObjectId | null> => {
  if (documentTypeName) {
    // First find the document type by name
    const documentType = await DocumentType.findOne({
      type: { $regex: new RegExp('^' + documentTypeName + '$', 'i') },
    }).select('-createdAt -updatedAt -__v');
    if (documentType) {
      return (documentType._id as unknown) as ObjectId;
    }
  }
  return null;
};
