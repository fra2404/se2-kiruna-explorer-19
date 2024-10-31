import { NextFunction, Request, Response } from 'express';
import { CustomError } from '@utils/customError';
import { addingDocument } from '../services/document.service'; 

export const addDocument = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { title, stakeholders, scale, type, connections, language, media, coordinates, summary } = req.body;

        // Call the service to add the document
        const newDocument = await addingDocument({
            title,
            stakeholders,
            scale,
            type,
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

