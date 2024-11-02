import Document from '../schemas/document.schema'; 
import { IDocument } from '@interfaces/document.interface'; 
import { IDocumentResponse } from '@interfaces/document.return.interface';
import { BadConnectionError, DocNotFoundError } from "../utils/errors";
import { ICoordinate } from '@interfaces/coordinate.interface';
import { getCoordinateById } from './coordinatetest.service';

//addDocument(Story 1)
export const addingDocument = async (documentData: IDocument): Promise<void> => {
    try {
        const newDocument = new Document(documentData);
        await newDocument.save();
    } catch (error) {
        throw new BadConnectionError();
    }
};

// //getDocuments(Story 1)
// export const getAllDocuments = async (): Promise<IDocument[]> => {
//     try {
//         const documents = await Document.find(); 
//         return documents; 
//     } catch (error) {
//         throw new DocNotFoundError(); 
//     }
// };

// Get all documents with their coordinates as IDocumentResponse
export const getAllDocuments = async (): Promise<IDocumentResponse[]> => {
    try {
        const documents = await Document.find(); // Fetch all documents
        
        // Fetch coordinates for each document
            const DocumentsResponse: IDocumentResponse[] = await Promise.all(documents.map(async (document) => {
            const coordinateId = document.coordinates; // Get the coordinate ID
            let coordinate: ICoordinate | null = null;

            // If there is a coordinate ID, fetch the coordinate
            if (coordinateId) {
                coordinate = await getCoordinateById(coordinateId.toString());
            }

            // Return the result as IDocumentResponse
            return {
                id: document.id,
                title: document.title,
                stakeholders: document.stakeholders,
                scale: document.scale,
                type: document.type,
                date: document.date,
                connections: document.connections || [], 
                language: document.language,
                media: document.media,
                coordinates: coordinate || null, // Set coordinates or null
                summary: document.summary,
            };
        }));

        return DocumentsResponse; 
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

//updateDocument(story 2)
export const updatingDocument = async (id: string, updateData: Partial<IDocument>): Promise<IDocument | null> => {
    try {
            const updatedDocument = await Document.findByIdAndUpdate(id, updateData, {
            new: true,             
            runValidators: true,   
        });

        return updatedDocument;
    } catch (error) {
        console.log(error);
        throw new Error('Failed to update document');
    }
};