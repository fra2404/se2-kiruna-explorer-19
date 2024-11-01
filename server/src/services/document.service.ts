import Document from '../schemas/document.schema'; 
import { IDocument } from '@interfaces/document.interface'; 
import { BadConnectionError, DocNotFoundError } from "../utils/errors";

//addDocument(Story 1)
export const addingDocument = async (documentData: IDocument): Promise<void> => {
    try {
        const newDocument = new Document(documentData);
        await newDocument.save();
    } catch (error) {
        throw new BadConnectionError();
    }
};

//getDocuments(Story 1)
export const getAllDocuments = async (): Promise<IDocument[]> => {
    try {
        const documents = await Document.find(); 
        return documents; 
    } catch (error) {
        throw new DocNotFoundError(); 
    }
};

//getDocument(story 3)
export const getDocumentById = async (id: string): Promise<IDocument | null> => {
    try {
        const document = await Document.findById(id);
        return document;
    } catch (error) {
        throw new DocNotFoundError(); 
    }
};
