import { Request, Response, NextFunction } from 'express';
import {
  addingDocument,
  getAllDocuments,
  getDocumentById,
  updatingDocument,
  deleteDocumentByName,
  getDocumentTypes,
  getDocumentByType,
  searchDocuments,
} from '../services/document.service';
// import { addingDocument, deleteDocumentByName, getAllDocuments, getDocumentById, updatingDocument } from '../services/document.service';
import { IDocument } from '@interfaces/document.interface';
import { IDocumentResponse } from '@interfaces/document.return.interface';
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
 *           type: array
 *             items:
 *              type: string
 *              description: The stakeholders of the document
 *              enum:
 *                - LKAB
 *                - Municipalty
 *                - RegionalAuthority
 *                - ArchitectureFirms
 *                - Citizens
 *                - Others
 *         scale:
 *           type: string
 *           description: The scale of the document (e.g., 'Architectural', 'blueprints/effects', 'text')
 *         architecturalScale:
 *           type: string
 *           description: The value in number:number format, required when scale is 'Architectural'
 *           example: "1:1000"
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
 * /api/documents/create:
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
export const addDocumentController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const newDocument = await addingDocument(req.body as IDocument);
    res.status(201).json(newDocument);
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
export const getAllDocumentsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
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
export const getDocumentByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
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
export const updateDocumentController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
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

export const getDocumentTypesController = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const docTypes = getDocumentTypes();
    res.status(200).json({ docTypes });
  } catch (error) {
    next(error); // Pass the error to the error handler middleware
  }
};

/**
 * @swagger
 * /documents/types/{type}:
 *   get:
 *     summary: Get documents by type
 *     description: Retrieve all documents of a specified type.
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         description: The type of the document (e.g., AGREEMENT, CONFLICT, CONSULTATION).
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of documents of the specified type.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 documents:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Document'
 *       404:
 *         description: No documents found for the specified type.
 *       500:
 *         description: Internal server error.
 *
 * components:
 *   schemas:
 *     Document:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: '60d0fe4f5311236168a109ca'
 *         title:
 *           type: string
 *           example: 'Sample Document'
 *         stakeholders:
 *           type: string
 *           example: 'Stakeholder 1'
 *         scale:
 *           type: string
 *           example: 'Architectural'
 *         architecturalScale:
 *           type: string
 *           description: The value in number:number format, required when scale is 'Architectural'
 *           example: '1:1000'
 *         type:
 *           type: string
 *           example: 'AGREEMENT'
 *         date:
 *           type: string
 *           example: '2024-11-05'
 *         connections:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               document:
 *                 type: string
 *                 example: '60d0fe4f5311236168a109ca'
 *               type:
 *                 type: string
 *                 example: 'LINK1'
 *         language:
 *           type: string
 *           example: 'English'
 *         media:
 *           type: array
 *           items:
 *             type: string
 *         coordinates:
 *           type: string
 *         summary:
 *           type: string
 *           example: 'This is a summary of the document.'
 */

export const getDocumentsByTypeController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { type } = req.params;
  try {
    const documents = await getDocumentByType(type);

    res.status(200).json({ documents });
  } catch (error) {
    next(error); // Pass the error to the error handler middleware
  }
};

/* istanbul ignore next */
export const deleteDocumentController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result: string = await deleteDocumentByName('TestDoc');

    res.json(result);
  } catch (error) {
    next(error); // Pass the error to the error handler middleware
  }
};

/**
 * @swagger
 * /documents/search:
 *   get:
 *     summary: Search documents by multiple keywords
 *     description: Retrieve all documents that match the specified keywords in the title or summary.
 *     parameters:
 *       - in: query
 *         name: keywords
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of documents that match the specified keyword.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 documents:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Document'
 *       404:
 *         description: No documents found for the specified keyword.
 *       500:
 *         description: Internal server error.
 *
 * components:
 *   schemas:
 *     Document:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: '60d0fe4f5311236168a109ca'
 *         title:
 *           type: string
 *           example: 'Sample Document'
 *         stakeholders:
 *           type: string
 *           example: 'Stakeholder 1'
 *         scale:
 *           type: string
 *           example: 'Architectural'
 *         architecturalScale:
 *           type: string
 *           description: The value in number:number format, required when scale is 'Architectural'
 *           example: '1:1000'
 *         type:
 *           type: string
 *           example: 'AGREEMENT'
 *         date:
 *           type: string
 *           example: '2024-11-05'
 *         connections:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               document:
 *                 type: string
 *                 example: '60d0fe4f5311236168a109ca'
 *               type:
 *                 type: string
 *                 example: 'LINK1'
 *         language:
 *           type: string
 *           example: 'English'
 *         media:
 *           type: array
 *           items:
 *             type: string
 *         coordinates:
 *           type: string
 *         summary:
 *           type: string
 *           example: 'This is a summary of the document.'
 */

export const searchDocumentsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    let keywords: string[] = [];
    if (req.query.keywords) {
      keywords = JSON.parse(req.query.keywords as string); // Parse the input query string into an array of keywords
    }

    const documents = await searchDocuments(keywords, req.body);
    res.status(200).json(documents);
  } catch (error) {
    next(error); // Pass the error to the error handler middleware
  }
};
