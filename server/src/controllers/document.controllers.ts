import { NextFunction, Request, Response } from 'express';
import { CustomError } from '@utils/customError';
import {
    addingDocument,
    getAllDocuments,
    getDocumentById,
    updatingDocument
} from '../services/document.service';
import { IDocument } from '@interfaces/document.interface';
import { IDocumentResponse } from '@interfaces/document.return.interface';


/**
 * @swagger
 * components:
 *   schemas:
 *     Document:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The document ID
 *         title:
 *           type: string
 *           description: The title of the document
 *         stakeholders:
 *           type: string
 *           description: The stakeholders involved in the document
 *         scale:
 *           type: string
 *           description: The scale of the document
 *         type:
 *           type: string
 *           description: The type of document
 *           enum:
 *             - DETAILED_PLAN
 *             - COMPETITION
 *             - AGREEMENT
 *             - DEFORMATION_FORECAST
 *         date:
 *           type: string
 *           format: date
 *           description: The date related to the document
 *         connections:
 *           type: array
 *           items:
 *             type: string
 *           description: An array of related document IDs
 *         language:
 *           type: string
 *           description: The language of the document
 *         media:
 *           type: array
 *           items:
 *             type: string
 *           description: Media associated with the document
 *         coordinates:
 *           type: string
 *           description: Geographic coordinates related to the document
 *         summary:
 *           type: string
 *           description: A brief summary of the document
 *     DocumentResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Indicates if the operation was successful
 *         data:
 *           $ref: '#/components/schemas/Document'
 */

/**
 * @swagger
 * tags:
 *   name: Documents
 *   description: Document management
 */

/**
 * @swagger
 * /documents/add:
 *   post:
 *     summary: Add a new document
 *     tags: [Documents]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Document'
 *     responses:
 *       201:
 *         description: Document created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DocumentResponse'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /documents:
 *   get:
 *     summary: Get all documents
 *     tags: [Documents]
 *     responses:
 *       200:
 *         description: Successfully retrieved documents
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Document'
 *       404:
 *         description: No documents found
 */

/**
 * @swagger
 * /documents/{id}:
 *   get:
 *     summary: Get a document by ID
 *     tags: [Documents]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the document to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Document retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DocumentResponse'
 *       404:
 *         description: Document not found
 */

/**
 * @swagger
 * /documents/{id}:
 *   put:
 *     summary: Update a document by ID
 *     tags: [Documents]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the document to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Document'
 *     responses:
 *       200:
 *         description: Document updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DocumentResponse'
 *       404:
 *         description: Document not found
 *       500:
 *         description: Internal server error
 */


//add new document
export const addDocument = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const document = req.body as IDocument;

        // Call the service
        const result = await addingDocument(document);

        //created document
        res.status(201).json({success: true, data: result});
    } catch (error) {
        next(error)
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};


// get all documents
export const getDocuments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        //Call the service
        const documents: IDocumentResponse[] = await getAllDocuments();

        // Check if documents were found
        if (documents.length === 0) {
            res.status(404).json({ success: false, message: 'No documents found on the DB' });
        }

        // Return list of documents
        res.status(201).json({success: true, data: documents});
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
        res.status(201).json({success: true, data: document});
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
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

