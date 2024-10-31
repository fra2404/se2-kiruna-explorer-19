import { NextFunction, Request, Response } from 'express';
import { CustomError } from '@utils/customError';
import { addingDocument, getAllDocuments } from '../services/document.service'; 
import { IDocument } from '@interfaces/document.interface';
export const addDocument = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { title, stakeholders, scale, type, date, connections, language, media, coordinates, summary } = req.body;

        // Call the service to add the document
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


export const getDocuments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
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


