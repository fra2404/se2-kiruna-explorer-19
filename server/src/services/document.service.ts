import Document from '../schemas/document.schema'; 
import { IDocument } from '@interfaces/document.interface'; 

//addDocument(Story1)
export const addingDocument = async (documentData: IDocument): Promise<void> => {
    try {
        const newDocument = new Document(documentData);
        await newDocument.save();
    } catch (error) {
        console.log(error);
        throw new Error('Failed to add document');
    }
};

//getDocuments(Story1)
export const getAllDocuments = async (): Promise<IDocument[]> => {
    try {
        const documents = await Document.find(); 
        return documents; 
    } catch (error) {
        throw new Error('Failed to retrieve documents'); 
    }
};


