import Document from '../schemas/document.schema';
import MediaDocument from '../schemas/media.schema';
import { Coordinate } from '../schemas/coordinate.schema';
import { IDocument, IDocumentFilters } from '@interfaces/document.interface';
import { IDocumentResponse } from '@interfaces/document.return.interface';
import { DocNotFoundError, MediaNotFoundError, PositionError } from '../utils/errors';
import { ICoordinate } from '@interfaces/coordinate.interface';
import { getCoordinateById } from './coordinate.service';
import { DocTypeEnum } from '@utils/enums/doc-type.enum';
import { CustomError } from '@utils/customError';
import { getMediaMetadataById } from './media.service';
import { ObjectId } from 'mongoose';
import { IReturnMedia } from '@interfaces/media.return.interface';

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



  //Check existence of media in DB
  if (documentData.media && documentData.media.length > 0) {
    for (const mediaId of documentData.media) {
      const existingMedia = await MediaDocument.findById(mediaId); 
      if (!existingMedia) {
        throw new MediaNotFoundError(); 
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

  //Call method to fetch media metadata
  let media: IReturnMedia[] | null = null;
  if (newDocument.media && newDocument.media.length > 0) {
        media = await fetchMedia(newDocument.media);
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
    media, 
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


  //Call method to fetch media metadata
  let media: IReturnMedia[] | null = null;
  if (document.media && document.media.length > 0) {
        media = await fetchMedia(document.media);
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
        media: media || null, 
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


  //Call method to fetch media metadata
  let media: IReturnMedia[] | null = null;
  if (document.media && document.media.length > 0) {
        media = await fetchMedia(document.media);
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
    media: media || null,
  };
};

export const searchDocuments = async (
  keywords: string[],
  filters?: IDocumentFilters,
): Promise<IDocumentResponse[] | null> => {
  // With the operator $and we combine the keywords to search for in the title and summary
  const keywordQuery = {
    $and: keywords.map((keyword) => ({
      $or: [
        { title: { $regex: keyword, $options: 'i' } },
        { summary: { $regex: keyword, $options: 'i' } },
      ],
    })),
  };

  let filterQuery: { [key: string]: any } = {}; // Query to apply filters

  if (filters) {
    const filterConditions = []; // Array to store filter conditions, initially empty
    if (filters.stakeholders) {
      filterConditions.push({
        stakeholders: { $regex: filters.stakeholders, $options: 'i' },
      });
    }
    if (filters.scale) {
      filterConditions.push({
        scale: { $regex: filters.scale, $options: 'i' },
      });
    }
    if (filters.type) {
      filterConditions.push({ type: filters.type });
    }
    if (filters.date) {
      filterConditions.push({ date: { $regex: filters.date, $options: 'i' } });
    }
    if (filters.language) {
      filterConditions.push({
        language: { $regex: filters.language, $options: 'i' },
      });
    }
    // Ignore the filters that are not in the document schema
    if (filterConditions.length > 0) {
      filterQuery = { $and: filterConditions };
    }
  }
  const query = { ...keywordQuery, ...filterQuery };

  const documents = await Document.find(query);
  if (documents.length === 0) {
    return [] as IDocumentResponse[];
  }
  return Promise.all(
    documents.map(async (document) => {
      const documentObject = document.toObject();
      delete documentObject._id;
      delete documentObject.createdAt;
      delete documentObject.updatedAt;
      delete documentObject.__v;

      let coordinate: ICoordinate | null = null;
      const coordinateId = document.coordinates;

      if (coordinateId) {
        coordinate = await getCoordinateById(coordinateId.toString());
      }

 //Call method to fetch media metadata
 let media: IReturnMedia[] | null = null;
 if (document.media && document.media.length > 0) {
       media = await fetchMedia(document.media);
  }


      return {
        id: document.id,
        ...documentObject,
        coordinates: coordinate || null,
        media: media || null, 
      } as IDocumentResponse; 
    }),
  );
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


  ////Added By Mina
  //Check existence of media in DB
  if (updateData.media && updateData.media.length > 0) {
    for (const mediaId of updateData.media) {
      const existingMedia = await MediaDocument.findById(mediaId); 
      if (!existingMedia) {
        throw new MediaNotFoundError(); 
      }
    }

    updatedDocument.media = updatedDocument.media || [];

    for (const mediaId of updateData.media) {
      if (!updatedDocument.media.includes(mediaId)) {
        updatedDocument.media.push(mediaId);
      }
    }

  }
  //******************


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

 //Call method to fetch media metadata
 let media: IReturnMedia[] | null = null;
 if (updatedDocument.media && updatedDocument.media.length > 0) {
       media = await fetchMedia(updatedDocument.media);
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
    media :  media || null,   //Added By Mina
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


    //Added By Mina
    // Fetch the media metadata if media exists
    let media: IReturnMedia[] | null = null;
    if (document.media && document.media.length > 0) {
      const mediaResults = await Promise.all(
        document.media.map((mediaId) => getMediaMetadataById(mediaId.toString()))
      );
  
      // Filter out null values
      media = mediaResults.filter((metadata): metadata is IReturnMedia => metadata !== null);
    }

  //*****************
      return {
        id: document.id,
        ...documentObject,
        coordinates: coordinate || null,
        media: media || null,
      } as IDocumentResponse;
    }),
  );
};

export const fetchMedia = async (mediaIds: ObjectId[]): Promise<IReturnMedia[] | null> => {
  if (mediaIds.length > 0) {
    const mediaResults = await Promise.all(
      mediaIds.map((mediaId) => getMediaMetadataById(mediaId.toString()))
    );
    return mediaResults.filter((metadata): metadata is IReturnMedia => metadata !== null);
  }
  return null;
};