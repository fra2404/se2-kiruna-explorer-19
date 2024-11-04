import { Request, Response, NextFunction } from 'express';
import { addingDocument, getAllDocuments, getDocumentById, updatingDocument } from '../services/document.service';
import { IDocument } from '@interfaces/document.interface';
import { IDocumentResponse } from '@interfaces/document.return.interface';
import { ICoordinate } from '@interfaces/coordinate.interface';
import { DocNotFoundError } from '@utils/errors';

/**
 * @swagger
 * components:
 *   schemas:
 *     Document:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The ID of the document
 *         title:
 *           type: string
 *           description: The title of the document
 *         stakeholders:
 *           type: string
 *           description: The stakeholders of the document
 *         scale:
 *           type: string
 *           description: The scale of the document
 *         type:
 *           type: string
 *           description: The type of the document
 *           enum:
 *             - AGREEMENT
 *             - CONFLICT
 *             - CONSULTATION
 *             - DESIGN_DOC
 *             - INFORMATIVE_DOC
 *             - MATERIAL_EFFECTS
 *             - PRESCRIPTIVE_DOC
 *             - TECHNICAL_DOC
 *         connections:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               document:
 *                 type: string
 *                 description: The ID of the connected document
 *               type:
 *                 type: string
 *                 description: The type of the connection
 *                 enum:
 *                   - LINK1
 *                   - LINK2
 *                   - LINK3
 *         language:
 *           type: string
 *           description: The language of the document
 *         summary:
 *           type: string
 *           description: The summary of the document
 *         date:
 *           type: string
 *           description: The date of the document in the format dd-mm-yyyy
 *         coordinates:
 *           type: object
 *           $ref: '#/components/schemas/Coordinate'
 *     
 */

/**
 * @swagger
 * /api/documents:
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
 *         description: Document added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 document:
 *                   $ref: '#/components/schemas/Document'
 */
export const addDocumentController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const newDocument = await addingDocument(req.body as IDocument);
        res.status(201).json({ message: 'Document added successfully', document: newDocument });
    } catch (error) {
        next(error); // Pass the error to the error handler middleware
    }
};

/**
 * @swagger
 * /api/documents:
 *   get:
 *     summary: Get all documents
 *     tags: [Documents]
 *     responses:
 *       200:
 *         description: List of all documents
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Document'
 */
export const getAllDocumentsController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const documents: IDocumentResponse[] = await getAllDocuments();
        res.status(200).json(documents);
    } catch (error) {
        next(error); // Pass the error to the error handler middleware
    }
};

/**
 * @swagger
 * /api/documents/{id}:
 *   get:
 *     summary: Get a document by ID
 *     tags: [Documents]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The document ID
 *     responses:
 *       200:
 *         description: Document data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Document'
 *       404:
 *         description: Document not found
 */
export const getDocumentByIdController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const document = await getDocumentById(req.params.id);
        if (!document) {
            throw new DocNotFoundError();
        }
        res.status(200).json(document);
    } catch (error) {
        next(error); // Pass the error to the error handler middleware
    }
};

/**
 * @swagger
 * /api/documents/{id}:
 *   put:
 *     summary: Update a document by ID
 *     tags: [Documents]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The document ID
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
 *               $ref: '#/components/schemas/Document'
 *       404:
 *         description: Document not found
 */
export const updateDocumentController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const updatedDocument = await updatingDocument(req.params.id, req.body);
        if (!updatedDocument) {
            throw new DocNotFoundError();
        }
        res.status(200).json(updatedDocument);
    } catch (error) {
        next(error); // Pass the error to the error handler middleware
    }
};