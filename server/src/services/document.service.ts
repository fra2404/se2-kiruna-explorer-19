import Document from '../schemas/document.schema'; 
import { IDocument } from '@interfaces/document.interface'; 

export const addingDocument = async (documentData: IDocument): Promise<void> => {
    try {
        const newDocument = new Document(documentData);
        await newDocument.save();
    } catch (error) {
        throw new Error('Failed to add document');
    }
};



