import Document from '../schemas/document.schema';
import Stakeholder from '../schemas/stakeholder.schema';
import DocumentType from '../schemas/documentType.schema';
import MediaDocument from '../schemas/media.schema';
import { Coordinate } from '../schemas/coordinate.schema';
import { IDocument, IDocumentFilters } from '@interfaces/document.interface';
import { IDocumentResponse } from '@interfaces/document.return.interface';
import {
  DocNotFoundError,
  MediaNotFoundError,
  PositionError,
  StakeholderNotFoundError,
  DocumentTypeNotFoundError,
} from '../utils/errors';
import { ICoordinate } from '@interfaces/coordinate.interface';
import { getCoordinateById } from './coordinate.service';
import { fetchMedia, getMediaMetadataById } from './media.service';
import { ObjectId as MongoObjectId } from 'mongodb';
import { IReturnMedia } from '@interfaces/media.return.interface';
import { IStakeholder } from '@interfaces/stakeholder.interface';
import { fetchStakeholders, fetchStakeholdersForSearch, getStakeholdersById } from './stakeholder.service';
import { IDocumentType } from '@interfaces/documentType.interface';
import { fetchDocumentTypes, fetchDocumentTypesForSearch, getDocumentTypeById } from './documentType.service';


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

  //Check existence of stakeholder in DB
  if (documentData.stakeholders && documentData.stakeholders.length > 0) {
    for (const stakeholderId of documentData.stakeholders) {
      const existingStakeholder = await Stakeholder.findById(stakeholderId);
      if (!existingStakeholder) {
        throw new StakeholderNotFoundError();
      }
    }
  }

  // Check for duplicate stakeholder IDs in the array
  if (documentData.stakeholders && documentData.stakeholders.length > 0) {
    for (let i = 0; i < documentData.stakeholders.length; i++) {
      const stakeholderId = documentData.stakeholders[i];
      if (documentData.stakeholders.indexOf(stakeholderId) !== i) {
        throw new Error("Duplicate stakeholderID found");
      }
    }
  }

  //Check existence of documentType in DB
  if (documentData.type) {
    const existingDocumentType = await DocumentType.findById(documentData.type);
    if (!existingDocumentType) {
      throw new DocumentTypeNotFoundError();
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

  //call method to fetch stakeholders
  let stakeholders: IStakeholder[] = [];
  if (newDocument.stakeholders && newDocument.stakeholders.length > 0) {
    stakeholders = await fetchStakeholders(newDocument.stakeholders);
  }

  //call method to fetch documentTypes
  let type: IDocumentType | null = null;
  if (newDocument.type) {
    type = await fetchDocumentTypes(newDocument.type);
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
    stakeholders,
    type,
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

      //call method to fetch stakeholders
      let stakeholder: IStakeholder[] = [];
      if (document.stakeholders && document.stakeholders.length > 0) {
        stakeholder = await fetchStakeholders(document.stakeholders);
      }

      //call method to fetch documentTypes
      let type: IDocumentType | null = null;
      if (document.type) {
        type = await fetchDocumentTypes(document.type);
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
        stakeholders: stakeholder,
        type: type,
      };
    }),
  );
  // console.log('Documents', DocumentsResponse);
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


  //call method to fetch stakeholders
  let stakeholder: IStakeholder[] = [];
  if (document.stakeholders && document.stakeholders.length > 0) {
    stakeholder = await fetchStakeholders(document.stakeholders);
  }

  
  //call method to fetch documentTypes
  let type: IDocumentType | null = null;
  if (document.type) {
    type = await fetchDocumentTypes(document.type);
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
    stakeholders: stakeholder,
    type: type,
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
    if (filters.stakeholders &&
      Array.isArray(filters.stakeholders) &&
      filters.stakeholders.length > 0) {

     // const stakeholderIds = await fetchStakeholdersForSearch(filters.stakeholders); // Convert the type name to ObjectId   
      if (filters.stakeholders.length === 1) {
        // Single item-look for any array containing this item
        filterConditions.push({
          stakeholders: { $in: filters.stakeholders },
        });
      } else {
        // Multiple items- look for exact combination in any order
        filterConditions.push({
          stakeholders: { $all: filters.stakeholders }, // Contains all items
          $expr: { $eq: [{ $size: "$stakeholders" }, filters.stakeholders.length] }, // Exact size match
        });
      }
    }
    if (filters.scale) {
      filterConditions.push({
        scale: { $regex: filters.scale, $options: 'i' },
      });
    }
    if (filters.architecturalScale) {
      filterConditions.push({
        architecturalScale: filters.architecturalScale
      });
    }
    // if (filters.type) {
    //   filterConditions.push({ type: filters.type });
    // }
    if (filters.type) {
    //  const documentTypeId = await fetchDocumentTypesForSearch(filters.type); // Convert the type name to ObjectId    
      if (filters.type) {
        filterConditions.push({ type: filters.type });
      }
    }


    if (filters.date) {
      filterConditions.push({ date: { $regex: filters.date, $options: 'i' } });
    }
    if (filters.language) {
      filterConditions.push({
        language: { $regex: filters.language, $options: 'i' },
      });
    }

    if (filters.coordinates) {
      const coordinatesId = new MongoObjectId(filters.coordinates)
      filterConditions.push({ coordinates: { $eq: coordinatesId } });
    }
    // Ignore the filters that are not in the document schema
    if (filterConditions.length > 0) {
      filterQuery = { $and: filterConditions };
    }
  }

  // Combine keywordQuery and filterQuery using $and
  const query = {
    $and: [...(keywordQuery.$and || []), ...(filterQuery.$and || [])],
  };

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


      //call method to fetch stakeholders
      let stakeholder: IStakeholder[] = [];
      if (document.stakeholders && document.stakeholders.length > 0) {
        stakeholder = await fetchStakeholders(document.stakeholders);
      }


         
     //call method to fetch documentTypes
     let type: IDocumentType | null = null;
     if (document.type) {
        type = await fetchDocumentTypes(document.type);
     }

      return {
        id: document.id,
        ...documentObject,
        coordinates: coordinate || null,
        media: media || null,
        stakeholders: stakeholder,
        type: type,
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

  // If the new scale is not 'Architectural' and architecturalScale has a value, delete architecturalScale
  if (updateData.scale && updateData.scale !== 'ARCHITECTURAL' && updatedDocument.architecturalScale) {
    updatedDocument.architecturalScale = "";
    await updatedDocument.save();
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

  //Check existence of stakeholder in DB
  if (updatedDocument.stakeholders && updatedDocument.stakeholders.length > 0) {
    for (const stakeholderId of updatedDocument.stakeholders) {
      const existingStakeholder = await Stakeholder.findById(stakeholderId);
      if (!existingStakeholder) {
        throw new StakeholderNotFoundError();
      }
    }
  }

  // Check for duplicate stakeholder IDs in the array
  if (updatedDocument.stakeholders && updatedDocument.stakeholders.length > 0) {    
    for (let i = 0; i < updatedDocument.stakeholders.length; i++) {
      const stakeholderId = updatedDocument.stakeholders[i];
      if (updatedDocument.stakeholders.indexOf(stakeholderId) !== i) {
        throw new Error("Duplicate stakeholderID found");
      }
    }
  }

   //Check existence of documentType in DB
    if (updatedDocument.type) {
      const existingDocumentType = await DocumentType.findById(updatedDocument.type);
      if (!existingDocumentType) {
        throw new DocumentTypeNotFoundError();
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

  //Call method to fetch media metadata
  let media: IReturnMedia[] | null = null;
  if (updatedDocument.media && updatedDocument.media.length > 0) {
    media = await fetchMedia(updatedDocument.media);
  }

  //call method to fetch stakeholders
  let stakeholder: IStakeholder[] = [];
  if (updatedDocument.stakeholders && updatedDocument.stakeholders.length > 0) {
    stakeholder = await fetchStakeholders(updatedDocument.stakeholders);
  }

  //call method to fetch documentTypes
  let type: IDocumentType | null = null;
  if (updatedDocument.type) {
      type = await fetchDocumentTypes(updatedDocument.type);
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
    media: media || null,
    stakeholders: stakeholder,
    type: type,
  };

  return document;
};

/* istanbul ignore next */
export const deleteDocumentByName = async (name: string): Promise<string> => {
  await Document.deleteMany({ title: name });
  return 'Documents deleted successfully';
};

export const getDocumentTypes = async () => {
  const docTypes = await DocumentType.find(); // Fetch document types from the DB
  if (docTypes.length === 0) {
    throw new DocumentTypeNotFoundError;
  }

  const result = docTypes.map(docType => ({
    label: docType.type,  
    value: docType._id.toString(), 
  }));
  return result;
};

export const getDocumentByType = async (
  type: string,
): Promise<IDocumentResponse[]> => {

 //First check existence of type in documentType collection and return corresponding objectId
 //const documentType = await DocumentType.findOne({ type: { $regex: new RegExp('^' + type + '$', 'i') },});

 const documentType = await DocumentType.findById(type);
 // Not Found DocumentType
 if (!documentType) {
   throw new DocumentTypeNotFoundError;
 }

 // Then find documents of that type based on documentTypeId
 const documents = await Document.find({ type: documentType}).select('-createdAt -updatedAt -__v');;
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
          document.media.map((mediaId) =>
            getMediaMetadataById(mediaId.toString())
          )
        );

        // Filter out null values
        media = mediaResults.filter(
          (metadata): metadata is IReturnMedia => metadata !== null,
        );
      }

      //call method to fetch stakeholders
      let stakeholder: IStakeholder[] = [];
      if (document.stakeholders && document.stakeholders.length > 0) {
        stakeholder = await fetchStakeholders(document.stakeholders);
      }

     
      //call method to fetch documentTypes
      let type: IDocumentType | null = null;
      if (document.type) {
      type = await fetchDocumentTypes(document.type);
     }
   

      //*****************
      return {
        id: document.id,
        ...documentObject,
        coordinates: coordinate || null,
        media: media || null,
        stakeholders: stakeholder,
        type: type,
      } as IDocumentResponse;
    }),
  );
};