import { Request, Response, NextFunction } from 'express';
import { addingDocumentType, getAllDocumentTypes } from '../services/documentType.service'
import { IDocumentType } from '@interfaces/documentType.interface';

//Add DocumentType
export const addDocumentTypeController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const newDocumentType = await addingDocumentType(req.body as IDocumentType);
      res.status(201).json(newDocumentType);
    } catch (error) {
      next(error); // Pass the error to the error handler middleware
    }
  };

  export const getAllDocumentTypesController = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const documentTypes: IDocumentType[] = await getAllDocumentTypes();
      res.status(200).json(documentTypes);
    } catch (error) {
      next(error); // Pass the error to the error handler middleware
    }
  };
