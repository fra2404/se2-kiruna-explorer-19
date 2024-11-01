import { NextFunction, Request, Response } from 'express';
import { CustomError } from '@utils/customError';
import { 
    addingDocument, 
    getAllDocuments, 
    getDocumentById,
    updatingDocument 
} from '../services/document.service'; 
import { IDocument } from '@interfaces/document.interface';

//add new document
export const addDocument = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { title, stakeholders, scale, type, date, connections, language, media, coordinates, summary } = req.body;

        // Call the service
        const newDocument = await addingDocument({
            title,
            stakeholders,
            scale,
            type,
            date,
            connections,
            language,
            media,
            coordinates,
            summary,
        });

        //created document
        res.status(201).json({
            success: true,
            data: newDocument,
        });
    } catch (error) {
        next(error)

        res.status(500).json({ success: false, message: 'Server Error' });
    }
};


// get all documents
export const getDocuments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        //Call the service
        const documents: IDocument[] = await getAllDocuments();
        
        // Check if documents were found
        if (documents.length === 0) {
            res.status(404).json({ success: false, message: 'No documents found on the DB' });
        }

        // Return list of documents
        res.json(documents);
    } catch (error) {
        next(error); 
    }
};


//get one document by ID
export const getDocument = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;

        // Call the service
        const document: IDocument | null = await getDocumentById(id);

        // Check if the document was found
        if (!document) {
            res.status(404).json({ success: false, message: 'Document not found' });
        }

        // Return the document
        res.json(document);
    } catch (error) {
        next(error); 
    }
};

//Update document
export const updateDocument = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Call the service function to update the document
        const updatedDocument = await updatingDocument(id, updateData);

        // If no document is found with the given ID, return an error response
        if (!updatedDocument) {
            res.status(404).json({ success: false, message: 'Document not found' });
            return;
        }

        // Successfully updated response
        res.status(200).json({
            success: true,
            data: updatedDocument,
        });
    } catch (error) {
        next(error);
    }
};

