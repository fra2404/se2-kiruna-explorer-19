import Document from '../schemas/document.schema'; 
import { IDocument } from '@interfaces/document.interface'; 

//addDocument(Story 1)
export const addingDocument = async (documentData: IDocument): Promise<void> => {
    try {
        const newDocument = new Document(documentData);
        await newDocument.save();
    } catch (error) {
        console.log(error);
        throw new Error('Failed to add document');
    }
};

//getDocuments(Story 1)
export const getAllDocuments = async (): Promise<IDocument[]> => {
    try {
        const documents = await Document.find(); 
        return documents; 
    } catch (error) {
        throw new Error('Failed to retrieve documents'); 
    }
};

//getDocument(story 3)
export const getDocumentById = async (id: string): Promise<IDocument | null> => {
    try {
        const document = await Document.findById(id);
        return document;
    } catch (error) {
        console.log(error);
        throw new Error('Failed to retrieve document'); 
    }
};
