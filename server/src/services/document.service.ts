import Document from '../schemas/document.schema';
import { Coordinate } from '../schemas/coordinate.schema';
import { IDocument } from '@interfaces/document.interface';
import { IDocumentResponse } from '@interfaces/document.return.interface';
import { DocNotFoundError, PositionError } from '../utils/errors';
import { ICoordinate } from '@interfaces/coordinate.interface';
import { getCoordinateById } from './coordinate.service';
import { DocTypeEnum } from '@utils/enums/doc-type.enum';
import { CustomError } from '@utils/customError';


//addDocument(Story 1)
export const addingDocument = async (
  documentData: IDocument,
): Promise<IDocumentResponse | null> => {
  // Check existence of Coordinate in DB
  if (documentData.coordinates) {
    const existingCoordinate = await Coordinate.findById(
      documentData.coordinates,
    );
    if (!existingCoordinate) {
      throw new PositionError();
    }
  }

  // Check existence of Connection in DB
  if (documentData.connections && documentData.connections.length > 0) {
    for (const connection of documentData.connections) {
      const existingDocument = await Document.findById(connection.document);
      if (!existingDocument) {
        throw new DocNotFoundError();
      }
    }
  }

  // Add new document
  const newDocument = new Document(documentData);
  await newDocument.save();

  // Update other part of connection by Id of new document
  if (documentData.connections && documentData.connections.length > 0) {
    for (const connection of documentData.connections) {
      const existingDocument = await Document.findById(connection.document);

      if (existingDocument) {
        existingDocument.connections = existingDocument.connections || [];

        existingDocument.connections.push({
          document: newDocument.id,
          type: connection.type,
        });
        await existingDocument.save();
      }
    }
  }

  let coordinates = null;
  if (newDocument.coordinates) {
    coordinates = await getCoordinateById(newDocument.coordinates.toString());
  }

  const documentObject = newDocument.toObject();
  delete documentObject._id;
  delete documentObject.createdAt;
  delete documentObject.updatedAt;
  delete documentObject.__v;

  const document: IDocumentResponse = {
    id: newDocument.id,
    ...documentObject,
    coordinates,
  };

  return document;
};

// Get all documents with their coordinates as IDocumentResponse
export const getAllDocuments = async (): Promise<IDocumentResponse[]> => {
  const documents = await Document.find(); // Fetch all documents

  // Fetch coordinates for each document
  const DocumentsResponse: IDocumentResponse[] = await Promise.all(
    documents.map(async (document) => {
      const coordinateId = document.coordinates; // Get the coordinate ID
      let coordinate: ICoordinate | null = null;

      // If there is a coordinate ID, fetch the coordinate
      if (coordinateId) {
        coordinate = await getCoordinateById(coordinateId.toString());
      }

      const documentObject = document.toObject();
      delete documentObject._id;
      delete documentObject.createdAt;
      delete documentObject.updatedAt;
      delete documentObject.__v;

      // Return the result as IDocumentResponse
      return {
        id: document.id,
        ...documentObject,
        coordinates: coordinate || null,
      };
    }),
  );

  return DocumentsResponse;
};

// Get document by ID
export const getDocumentById = async (
  id: string,
): Promise<IDocumentResponse | null> => {
  const document = await Document.findById(id);

  // If document does not exist
  if (!document) {
    throw new DocNotFoundError();
  }

  // Fetch the coordinate if it exists
  let coordinate: ICoordinate | null = null;
  const coordinateId = document.coordinates;

  if (coordinateId) {
    coordinate = await getCoordinateById(coordinateId.toString());
  }

  const documentObject = document.toObject();
  delete documentObject._id;
  delete documentObject.createdAt;
  delete documentObject.updatedAt;
  delete documentObject.__v;

  // Return the result as IDocumentResponse
  return {
    id: document.id,
    ...documentObject,
    coordinates: coordinate || null,
  };
};

// Update document
export const updatingDocument = async (
  id: string,
  updateData: Partial<IDocument>,
): Promise<IDocumentResponse | null> => {
  const updatedDocument = await Document.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!updatedDocument) {
    throw new DocNotFoundError();
  }

  if (updateData.coordinates) {
    const existingCoordinate = await Coordinate.findById(
      updateData.coordinates,
    );
    if (!existingCoordinate) {
      throw new PositionError();
    }
  }

  // Update connections
  if (updateData.connections && updateData.connections.length > 0) {
    // Clear existing connections
    if (updatedDocument.connections && updatedDocument.connections.length > 0) {
      for (const connection of updatedDocument.connections) {
        const existingDocument = await Document.findById(connection.document);
        if (existingDocument) {
          existingDocument.connections = existingDocument.connections?.filter(
            (conn) =>
              conn.document.toString() !== updatedDocument.id.toString(),
          );
          await existingDocument.save();
        }
      }
      updatedDocument.connections = [];
    }
    for (const connection of updateData.connections) {
      const existingDocument = await Document.findById(connection.document);

      if (!existingDocument) {
        throw new DocNotFoundError();
      }

      // Add the new connection
      updatedDocument.connections?.push({
        document: connection.document,
        type: connection.type,
      });

      // Update the other part of the connection
      existingDocument.connections = existingDocument.connections || [];
      existingDocument.connections.push({
        document: updatedDocument.id,
        type: connection.type,
      });

      await existingDocument.save();
    }

    await updatedDocument.save();
  }

  let coordinates = null;
  if (updatedDocument.coordinates) {
    coordinates = await getCoordinateById(
      updatedDocument.coordinates.toString(),
    );
  }

  const documentObject = updatedDocument.toObject();
  delete documentObject._id;
  delete documentObject.createdAt;
  delete documentObject.updatedAt;
  delete documentObject.__v;

  const document: IDocumentResponse = {
    id: updatedDocument.id,
    ...documentObject,
    coordinates,
  };

  return document;
};

/* istanbul ignore next */
export const deleteDocumentByName = async (name: string): Promise<string> => {
  await Document.deleteMany({ title: name });
  return 'Documents deleted successfully';
};

export const getDocumentTypes = () => {
  const docTypes = Object.entries(DocTypeEnum).map(([key, value]) => ({
    label: key,
    value: value,
  }));

  if (docTypes.length === 0) {
    throw new CustomError('No document types available', 404);
  }

  return docTypes;
};

export const getDocumentByType = async (
  type: string,
): Promise<IDocumentResponse[]> => {
  const documents = await Document.find({ type });

  // Not Found Document
  if (documents.length === 0) {
    throw new DocNotFoundError();
  }

  // Convert the documents to the desired response format
  return Promise.all(
    documents.map(async (document) => {
      const documentObject = document.toObject();
      delete documentObject._id;
      delete documentObject.createdAt;
      delete documentObject.updatedAt;
      delete documentObject.__v;

      // Fetch the coordinate if it exists
      let coordinate: ICoordinate | null = null;
      const coordinateId = document.coordinates;

      if (coordinateId) {
        coordinate = await getCoordinateById(coordinateId.toString());
      }

      return {
        id: document.id,
        ...documentObject,
        coordinates: coordinate || null,
      } as IDocumentResponse;
    }),
  );
};



