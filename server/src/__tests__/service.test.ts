import { jest, describe, expect } from '@jest/globals';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import mongoose, { ObjectId } from 'mongoose';
import fetchMock from 'jest-fetch-mock';

import User from '../schemas/user.schema';
import Document from '../schemas/document.schema';
import { Coordinate } from '../schemas/coordinate.schema';
import Media from '../schemas/media.schema';
import MediaDocument from '../schemas/media.schema';
import Stakeholder from '../schemas/stakeholder.schema';
import DocumentType from '../schemas/documentType.schema';

import { IUser } from '../interfaces/user.interface';
import { IConnection, IDocument, IDocumentFilters } from '../interfaces/document.interface';
import { ICoordinate } from '../interfaces/coordinate.interface';
import { IMedia } from '@interfaces/media.interface';
import { IReturnPresignedUrl } from '@interfaces/media.return.interface';

import {
  getAllUsers,
  createNewUser,
  getUserById,
  loginUser,
} from '../services/user.service';
import {
  addingDocument,
  getAllDocuments,
  getDocumentById,
  searchDocuments,
  updatingDocument,
  getDocumentTypes,
  getDocumentByType
} from '../services/document.service';
import {
  addCoordinateService,
  getAllCoordinates,
  getCoordinateById,
  deleteCoordinateById,
} from '@services/coordinate.service';
import {
  getTypeFromMimeType,
  uploadMediaService,
  updateMediaMetadata,
  getMediaMetadataById,
  fetchMedia
} from '@services/media.service';
import { 
  getGraphDatas 
} from '../services/graph.service';
import {
  fetchDocumentTypes,
  addingDocumentType,
  getAllDocumentTypes,
  fetchDocumentTypesForSearch, 
  getDocumentTypeById 
} from '../services/documentType.service';
import {
  fetchStakeholders,
  addingStakeholder,
  getAllStakeholders,
  getStakeholdersById,
  fetchStakeholdersForSearch
} from "../services/stakeholder.service"

import { UserRoleEnum } from '../utils/enums/user-role.enum';
import { DocTypeEnum } from '../utils/enums/doc-type.enum';
import { StakeholderEnum } from '@utils/enums/stakeholder.enum';
import { ScaleTypeEnum } from '@utils/enums/scale-type-enum';
import { CustomError } from '../utils/customError';
import {
  DocNotFoundError,
  UserNotAuthorizedError,
  PositionError,
  MediaNotFoundError,
  StakeholderNotFoundError,
  DocumentTypeNotFoundError
} from '../utils/errors';
import { mock } from 'node:test';
import { IDocumentType } from '@interfaces/documentType.interface';

//MOCKS
jest.mock('../schemas/user.schema'); //suite n#1
jest.mock('../schemas/coordinate.schema'); //suite n#2
jest.mock('../schemas/document.schema'); //suite n#3
jest.mock('../schemas/media.schema'); //suite n#4
jest.mock('../schemas/document.schema'); //suite n#5
jest.mock('../schemas/documentType.schema'); //suite n#6
jest.mock('../schemas/stakeholder.schema'); //suite n#7

jest.mock('bcrypt'); //Used in suite n#1
jest.mock('jsonwebtoken'); //Used in suite n#1
jest.mock('node-fetch', () => jest.fn()); //Used in suite n#4
fetchMock.enableMocks();

/* ******************************************* Suite n#1 - USERS ******************************************* */
describe('Tests for user services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  //getAllUsers
  describe('Tests for getAllUsers', () => {
    //test 1
    test('Should return all users', async () => {
      //Data mocking
      const mockUsers = [
        {
          id: '1',
          name: 'Sergio',
          email: 'sergio@ex.com',
          surname: 'Cicero',
          phone: '123456789',
          role: UserRoleEnum.Visitor,
        },
        {
          id: '2',
          name: 'Francesco',
          email: 'francesco@ex.com',
          surname: 'Albano',
          phone: '987654321',
          role: UserRoleEnum.Resident,
        },
      ];

      //Support functions mocking
      const findMock = jest
        .spyOn(User, 'find')
        .mockResolvedValue(mockUsers as any);

      //Call of getAllUsers
      const result = await getAllUsers();

      //Checking results
      expect(result).toEqual([
        {
          id: '1',
          name: 'Sergio',
          email: 'sergio@ex.com',
          surname: 'Cicero',
          phone: '123456789',
          role: UserRoleEnum.Visitor,
        },
        {
          id: '2',
          name: 'Francesco',
          email: 'francesco@ex.com',
          surname: 'Albano',
          phone: '987654321',
          role: UserRoleEnum.Resident,
        },
      ]);

      expect(User.find).toHaveBeenCalledTimes(1);
      findMock.mockRestore();
    });
  }); //getAllUsers
  /* ************************************************** */

  //createNewUser
  describe('Tests for createNewUser', () => {
    //test 1
    test('Should create a new user', async () => {
      //Data mocking
      const mockUser: IUser = {
        name: 'Sergio',
        email: 'sergio@ex.com',
        password: 'password123',
        surname: 'Cicero',
        phone: '123456789',
        role: UserRoleEnum.Visitor,
      };

      //Encrypting functions mocking
      const saltMock = jest
        .spyOn(bcrypt, 'genSalt')
        .mockImplementation(async () => 'fakeSalt');
      const hashMock = jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation(async () => 'fakeHashedPassword');
      const saveMock = jest
        .spyOn(User.prototype, 'save')
        .mockResolvedValueOnce({});

      //Call of createNewUser
      const result = await createNewUser(mockUser);

      //Checking results
      expect(result).toBe('User created successfully');
      expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 'fakeSalt');
      expect(saveMock).toHaveBeenCalledTimes(1);

      saltMock.mockRestore();
      hashMock.mockRestore();
      saveMock.mockRestore();
    });

    //test 2
    test('Should return an error because of the absence of a password', async () => {
      //Data mocking
      const mockUser: IUser = {
        name: 'Sergio',
        email: 'sergio@ex.com',
        password: '',
        surname: 'Cicero',
        phone: '123456789',
        role: UserRoleEnum.Visitor,
      };

      //Call of createNewUser
      await expect(createNewUser(mockUser)).rejects.toThrow(CustomError);
      await expect(createNewUser(mockUser)).rejects.toThrow(
        'Password is required',
      );
    });
  }); //createNewUser
  /* ************************************************** */

  //getUserById
  describe('Tests for getUserById', () => {
    //test 1
    test('Should return a user', async () => {
      //Data mocking
      const mockUser = {
        id: '1',
        name: 'Diego',
        email: 'diego@ex.com',
        surname: 'Porto',
        phone: '123456789',
        role: UserRoleEnum.Uplanner,
      };

      //Support functions mocking
      const findMock = jest
        .spyOn(User, 'findById')
        .mockResolvedValue(mockUser as any);

      //Call of getUserById
      const result = await getUserById('1');

      //Checking results
      expect(result).toEqual({
        id: '1',
        name: 'Diego',
        email: 'diego@ex.com',
        surname: 'Porto',
        phone: '123456789',
        role: UserRoleEnum.Uplanner,
      });

      expect(User.findById).toHaveBeenCalledTimes(1);
      findMock.mockRestore();
    });

    //test 2
    test("Should return null if the user isn't found", async () => {
      //Support functions mocking
      (User.findById as jest.Mock).mockImplementation(async () => null);

      //Call of getUserById with a non-sense id
      const result = await getUserById('AAA');

      expect(result).toBeNull();
    });
  }); //getUserById
  /* ************************************************** */

  //loginUser
  describe('Tests for loginUser', () => {
    const wrongMockMail = 'lautaro@ex.com';
    const wrongMockPassword = 'password123';

    //test 1
    test('Should successfully log a user', async () => {
      //Data mocking
      const mockUser = {
        _id: '1',
        name: 'Sergio',
        email: 'sergio@ex.com',
        surname: 'Cicero',
        phone: '123456789',
        password: 'hashed-password',
        role: UserRoleEnum.Visitor,
      };

      const choosenEmailMock = 'sergio@ex.com';
      const choosenPassMock = 'password12';
      const fakeToken = 'fake_token_value';

      //Support functions mocking
      (User.findOne as jest.Mock).mockImplementation(async () => mockUser);
      (bcrypt.compare as jest.Mock).mockImplementation(async () => true);
      (jwt.sign as jest.Mock).mockReturnValue(fakeToken);

      //Call of loginUser
      const result = await loginUser(choosenEmailMock, choosenPassMock);

      expect(result).toEqual({ token: fakeToken });
      expect(User.findOne).toHaveBeenCalledWith({ email: choosenEmailMock });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        choosenPassMock,
        mockUser.password,
      );
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: mockUser._id, email: mockUser.email, role: mockUser.role },
        expect.any(String),
        { expiresIn: '1h' },
      );
    });

    //test 2
    test('Should throw UserNotAuthorizedError if the mail is wrong', async () => {
      //Data mocking
      const err = new UserNotAuthorizedError();

      //Support functions mocking
      (User.findOne as jest.Mock).mockImplementation(async () => null);

      //Call of loginUser
      await expect(loginUser(wrongMockMail, wrongMockPassword)).rejects.toThrow(err);

      expect(User.findOne).toHaveBeenCalledWith({ email: wrongMockMail });
    });

    //test 3
    test('Should throw UserNotAuthorizedError if the password is wrong', async () => {
      //Data mocking
      const err = new UserNotAuthorizedError();
      const mockUserInputs = { email: wrongMockMail, password: 'hashed-value' };

      (User.findOne as jest.Mock).mockImplementation(
        async () => mockUserInputs,
      );
      (bcrypt.compare as jest.Mock).mockImplementation(async () => false);

      await expect(loginUser(wrongMockMail, wrongMockPassword)).rejects.toThrow(
        err,
      );
      expect(User.findOne).toHaveBeenCalledWith({ email: wrongMockMail });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        wrongMockPassword,
        'hashed-value',
      );
    });
  }); //loginUser
  /* ************************************************** */
}); //END OF USER SERVICES

/* ******************************************* Suite n#2 - COORDINATES ******************************************* */
describe('Tests for coordinate services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  //getCoordinateById
  describe('Tests for getCoordinateById', () => {
    //Input mocking
    const coordinateId = '1';

    //test 1
    test('Should successfully retrieve a coordinate object', async () => {
      //Data mocking
      const mockCoordinate = {
        id: coordinateId,
        type: 'Point',
        coordinates: [45.123, 7.123],
        name: 'Test coordinate',
      };

      //Support functions mocking
      jest
        .spyOn(Coordinate, 'findById')
        .mockResolvedValue({ toObject: () => mockCoordinate });

      //Call of getCoordinateById
      const result = await getCoordinateById(coordinateId);

      expect(Coordinate.findById).toHaveBeenCalledWith(coordinateId);
      expect(result).toEqual(mockCoordinate);
    });

    //test 2
    test('Should return null if the coordinate is not found', async () => {
      //Support functions mocking
      (Coordinate.findById as jest.Mock).mockImplementation(async () => null);

      //Call of getCoordinateById
      const result = await getCoordinateById(coordinateId);

      expect(Coordinate.findById).toHaveBeenCalledWith(coordinateId);
      expect(result).toBeNull();
    });

    //test 3
    test('Should throw an error if the connection with the DB fails', async () => {
      //Data mocking
      const err = new CustomError('Internal Server Error', 500);

      //Support functions mocking
      (Coordinate.findById as jest.Mock).mockImplementation(async () => err);

      //getCoordinateById
      await expect(getCoordinateById(coordinateId)).rejects.toThrow(err);

      expect(Coordinate.findById).toHaveBeenCalledWith(coordinateId);
    });
  }); //getCoordinateById
  /* ************************************************** */

  //addCoordinateService
  describe('Tests for addCoordinateService', () => {
    //Input mocking
    const mockCoordinate = {
      type: 'Point',
      coordinates: [45.123, 7.123],
      name: 'Test coordinate',
    } as ICoordinate;

    //test 1
    test('Should successfully save a new coordinate', async () => {
      //Support functions mocking
      (Coordinate.prototype.save as jest.Mock).mockImplementation(
        async () => mockCoordinate,
      );
      (Coordinate.prototype.toObject as jest.Mock).mockReturnValueOnce(
        mockCoordinate
      );

      //Call of addCoordinateService
      const result = await addCoordinateService(mockCoordinate);

      expect(Coordinate.prototype.save).toHaveBeenCalled();
      expect(result).toEqual(mockCoordinate);
    });

    //test 2
    test('Should throw an error if the connection with the DB fails', async () => {
      //Data mocking
      const err = new CustomError('Internal Server Error', 500);

      //Support functions mocking
      jest.spyOn(Coordinate.prototype, 'save').mockRejectedValue(err);
      //The code interrupts before "toObject" is called, so there is no need to mock its call

      //Call of addCoordinateService
      await expect(addCoordinateService(mockCoordinate)).rejects.toThrow(err);

      expect(Coordinate.prototype.save).toHaveBeenCalled();
    });
  }); //addCoordinateService
  /* ************************************************** */

  //getAllCoordinates
  describe('Tests for getAllCoordinates', () => {
    //test 1
    test('Should successfully retrieve all saved coordinates', async () => {
      // Data mocking
      const mockCoordinates = [
        {
          id: '1',
          type: 'Point',
          coordinates: [45.123, 7.123],
          name: 'Test Coordinate 1',
        },
        {
          id: '2',
          type: 'Area',
          coordinates: [
            [45.123, 7.123],
            [46.123, 8.123],
          ],
          name: 'Test Coordinate 2',
        },
      ];

      //Support functions mocking
      jest.spyOn(Coordinate, 'find').mockResolvedValue(
        mockCoordinates.map((coordinate) => ({
          ...coordinate,
          toObject: () => coordinate,
        }))
      );

      //Call of getAllCoordinates
      const result = await getAllCoordinates();

      expect(Coordinate.find).toHaveBeenCalled();
      expect(result).toEqual(mockCoordinates);
    });

    //test 2
    test('Should throw an error if the connection with the DB fails', async () => {
      //Data mocking
      const err = new PositionError();

      //Support functions mocking
      (Coordinate.find as jest.Mock).mockImplementation(async () => err);

      //getCoordinateById
      await expect(getAllCoordinates()).rejects.toThrow(err);

      expect(Coordinate.find).toHaveBeenCalled();
    });
  }); //getAllCoordinates
  /* ************************************************** */

  //deleteCoordinatesByNames won't be tested because the application doesn't use it (it was created for experiments purposes)
  /* ************************************************** */

  //deleteCoordinatesById
  describe('Tests for deleteCoordinatesById', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    //Data mock
    const mockCoordinate = {
      _id: new mongoose.Schema.Types.ObjectId('1234567890abcdef12345678'),
      coordinates: [45.123, 7.123],
      type: 'Point',
      name: 'Test Coordinate',
    };

    const mockDocument = {
      _id: new mongoose.Schema.Types.ObjectId('abcdef1234567890abcdef12'),
      coordinates: mockCoordinate._id,
    };

    //test 1
    test('Should throw PositionError', async () => {
      //Data mock
      const err = new PositionError();

      //Support functions mocking
      (Coordinate.findById as jest.Mock).mockImplementation(async () => null);

      //Call of deleteCoordinateById + result check
      await expect(
        deleteCoordinateById(mockCoordinate._id.toString()),
      ).rejects.toThrow(err);
    });

    //test 2
    test('Should throw an error if the coordinate is linked to a document', async () => {
      //Data mock
      const err = new CustomError('Coordinate is linked to a document', 400);

      //Support functions mocking
      (Coordinate.findById as jest.Mock).mockImplementation(
        async () => mockCoordinate,
      );
      (Document.findOne as jest.Mock).mockImplementation(
        async () => mockDocument,
      );

      //Call of deleteCoordinateById + result check
      await expect(
        deleteCoordinateById(mockCoordinate._id.toString()),
      ).rejects.toThrow(err);
    });

    //test 3
    test('Should delete the choosen coordinate', async () => {
      //Support functions mocking
      (Coordinate.findById as jest.Mock).mockImplementation(
        async () => mockCoordinate,
      );
      (Document.findOne as jest.Mock).mockImplementation(async () => null);
      (Coordinate.deleteOne as jest.Mock).mockImplementation(async () => {});

      //Call of deleteCoordinateById
      const result = await deleteCoordinateById(mockCoordinate._id.toString());

      expect(result).toBe(true);
      expect(Coordinate.deleteOne).toHaveBeenCalledWith({
        _id: mockCoordinate._id,
      });
    });
  }); //deleteCoordinatesById
}); //END OF COORDINATE SERVICES

/* ******************************************* Suite n#3 - DOCUMENTS ******************************************* */
describe('Tests for document services', () => {
  //addingDocument
  describe('Tests for addingDocument', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    //Mock of the document model
    //This is needed in order to mock the constructor of Document
    jest.mock("../schemas/document.schema", () => ({
      __esModule: true,
      default: jest.fn(),
    }));

    //Data mock
    const mockCoordinate = {
      id: 'c1',
      type: 'Point',
      coordinates: [45.123, 7.123],
      name: 'Test Coordinate',
    };

    const mockDocumentType = { 
      id: 'ty1', 
      type: DocTypeEnum.Agreement
    };

    //Just essentials fields are filled in this fake document
    const mockConnectedDoc = {
      id: 'cd1',
      save: jest.fn(),
      toObject: jest.fn().mockReturnValue(this)
    } as unknown as IDocument;
  
    const mockMedia = [
      { id: 'media1', url: 'https://example.com/media1' },
      { id: 'media2', url: 'https://example.com/media2' }
    ];

    const mockDocumentData = {
      title: 'Test Document',
      summary: 'Test summary',
      type: mockDocumentType.id,
      coordinates: mockCoordinate.id,
      media: ["media1", "media2"],
      connections: [{document: 'cd1'}],
      stakeholders: [StakeholderEnum.LKAB]
    } as unknown as IDocument;

    const mockNewDocument = {
      ...mockDocumentData,
      id: 'd1',
      scale: ScaleTypeEnum.BlueprintMaterialEffects,
      save: jest.fn(),
      toObject: jest.fn().mockReturnValue(this)
    } as IDocument;
  
    //test 1
    test("Should save the new document", async () => {
      //Support functions mocking
      (Coordinate.findById as jest.Mock).mockImplementation(async() => mockCoordinate);
      (Document.findById as jest.Mock).mockImplementation(async() => mockConnectedDoc);
      (MediaDocument.findById as jest.Mock)
        .mockImplementation(async() => mockMedia[0])
        .mockImplementation(async() => mockMedia[1]);

      //As said, here there is the code to mock the Document obj constructor
      const MockedDocument = Document as jest.Mocked<typeof Document>;
      MockedDocument.mockImplementation(() => mockNewDocument as any);

      jest.spyOn(Stakeholder, "findById").mockResolvedValueOnce(mockDocumentData.stakeholders);
      jest.spyOn(Coordinate, "findById").mockResolvedValueOnce(mockCoordinate);
      jest.spyOn(DocumentType, "findById").mockResolvedValueOnce(mockDocumentType);
      jest.spyOn(Document.prototype, "save").mockResolvedValueOnce(mockNewDocument);

      jest.spyOn(require("../services/coordinate.service"), "getCoordinateById")
        .mockResolvedValueOnce(mockCoordinate);
      jest.spyOn(require("../services/media.service"), "fetchMedia").mockResolvedValueOnce(mockMedia);
      jest.spyOn(require("../services/stakeholder.service"), "fetchStakeholders")
        .mockResolvedValueOnce(mockDocumentData.stakeholders);
      jest.spyOn(require("../services/documentType.service"), "fetchDocumentTypes")
        .mockResolvedValueOnce(mockDocumentType);
    
      //Call of addingDocument
      const result = await addingDocument(mockDocumentData);

      expect(Coordinate.findById).toHaveBeenCalledWith(mockCoordinate.id);
      expect(Document.findById).toHaveBeenCalledWith("cd1");
      expect(MediaDocument.findById).toHaveBeenCalledTimes(2);
      expect(Stakeholder.findById).toHaveBeenCalled();

      expect(getCoordinateById).toHaveBeenCalled();
      expect(fetchMedia).toHaveBeenCalled();
      expect(fetchStakeholders).toHaveBeenCalled();
      expect(fetchDocumentTypes).toHaveBeenCalled();

      expect(result).toEqual({
        id: 'd1',
        type: mockDocumentType,
        stakeholders: [StakeholderEnum.LKAB],
        coordinates: mockCoordinate,
        media: mockMedia
      });
    });

    //test 2
    test('Should throw PositionError if coordinates are not found', async () => {
      //Data mocking
      const err = new PositionError();

      //Support functions mocking
      (Coordinate.findById as jest.Mock).mockImplementation(async () => null);

      //Call of addingDocument
      await expect(addingDocument(mockDocumentData)).rejects.toThrow(err);

      expect(Coordinate.findById).toHaveBeenCalledWith(mockDocumentData.coordinates);
    });

    //test 3
    test("Should throw DocNotFoundError if the document specified in the connection doesn't exist", async () => {
      //Data mocking
      const err = new DocNotFoundError();

      //Support functions mocking
      (Coordinate.findById as jest.Mock).mockImplementation(async () => mockCoordinate);
      (Document.findById as jest.Mock).mockImplementation(async() => null);

      //Call of addingDocument
      await expect(addingDocument(mockDocumentData)).rejects.toThrow(err);

      expect(Coordinate.findById).toHaveBeenCalledWith(mockDocumentData.coordinates);
      expect(Document.findById).toHaveBeenCalledWith("cd1");
    });

    //test 4
    test("Should throw MediaNotFoundError", async () => {
      //Data mocking
      const err = new MediaNotFoundError();

      //Support functions mocking
      (Coordinate.findById as jest.Mock).mockImplementation(async () => mockCoordinate);
      (Document.findById as jest.Mock).mockImplementation(async() => mockConnectedDoc);
      (MediaDocument.findById as jest.Mock).mockImplementation(async() => null);

      //Call of addingDocument
      await expect(addingDocument(mockDocumentData)).rejects.toThrow(err);

      expect(Coordinate.findById).toHaveBeenCalledWith(mockDocumentData.coordinates);
      expect(Document.findById).toHaveBeenCalledWith("cd1");
      expect(MediaDocument.findById).toHaveBeenCalled();
    });

    //test 5
    test("Should throw StakeholderNotFoundError", async () => {
      //Data mocking
      const err = new StakeholderNotFoundError();

      //Support functions mocking
      (Coordinate.findById as jest.Mock).mockImplementation(async () => mockCoordinate);
      (Document.findById as jest.Mock).mockImplementation(async() => mockConnectedDoc);
      (MediaDocument.findById as jest.Mock).mockImplementation(async() => mockMedia);
      (Stakeholder.findById as jest.Mock).mockImplementation(async() => null);

      //Call of addingDocument
      await expect(addingDocument(mockDocumentData)).rejects.toThrow(err);

      expect(Coordinate.findById).toHaveBeenCalledWith(mockDocumentData.coordinates);
      expect(Document.findById).toHaveBeenCalledWith("cd1");
      expect(MediaDocument.findById).toHaveBeenCalledTimes(2);
      expect(Stakeholder.findById).toHaveBeenCalled();
    });

    //test 6
    test("Should throw an error if the same stakeholder is added more than once", async () => {
      //Data mocking
      const mockWrongData = {
        title: 'Test Document',
        summary: 'Test summary',
        coordinates: mockCoordinate.id,
        media: ["media1", "media2"],
        connections: [{document: 'cd1'}],
        stakeholders: [StakeholderEnum.LKAB, StakeholderEnum.LKAB]
      } as unknown as IDocument;

      const err = new Error("Duplicate stakeholderID found");

      //Support functions mocking
      (Coordinate.findById as jest.Mock).mockImplementation(async () => mockCoordinate);
      (Document.findById as jest.Mock).mockImplementation(async() => mockConnectedDoc);
      (MediaDocument.findById as jest.Mock).mockImplementation(async() => mockMedia);
      jest.spyOn(Stakeholder, "findById")
        .mockResolvedValueOnce(mockWrongData.stakeholders[0])
        .mockResolvedValueOnce(mockWrongData.stakeholders[1])

      //Call of addingDocument
      await expect(addingDocument(mockWrongData)).rejects.toThrow(err);

      expect(Coordinate.findById).toHaveBeenCalledWith(mockDocumentData.coordinates);
      expect(Document.findById).toHaveBeenCalledWith("cd1");
      expect(MediaDocument.findById).toHaveBeenCalledTimes(2);
      expect(Stakeholder.findById).toHaveBeenCalled();
    });

    //test 7
    test("Should throw DocumentTypeNotFoundError", async () => {
      //Data mocking
      const err = new DocumentTypeNotFoundError();

      //Support functions mocking
      (Coordinate.findById as jest.Mock).mockImplementation(async () => mockCoordinate);
      (Document.findById as jest.Mock).mockImplementation(async() => mockConnectedDoc);
      (MediaDocument.findById as jest.Mock).mockImplementation(async() => mockMedia);
      (Stakeholder.findById as jest.Mock).mockImplementation(async() => mockDocumentData.stakeholders);
      (DocumentType.findById as jest.Mock).mockImplementation(async() => null);

      //Call of addingDocument
      await expect(addingDocument(mockDocumentData)).rejects.toThrow(err);

      expect(Coordinate.findById).toHaveBeenCalledWith(mockDocumentData.coordinates);
      expect(Document.findById).toHaveBeenCalledWith("cd1");
      expect(MediaDocument.findById).toHaveBeenCalledTimes(2);
      expect(Stakeholder.findById).toHaveBeenCalled();
      expect(DocumentType.findById).toHaveBeenCalled();
    });
  }); //addingDocument
  /* ************************************************** */

  //getAllDocuments
  describe('Tests for getAllDocuments', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    //Data mock
    const mockType = {
      id: "ty1",
      type: DocTypeEnum.Agreement
    }

    const mockCoordinate = {
      _id: new mongoose.Types.ObjectId(),
      type: 'Point',
      coordinates: [45.123, 7.123],
      name: 'Test coordinate',
    };

    const mockMedia = [
      { id: 'media1', url: 'https://example.com/media1' },
      { id: 'media2', url: 'https://example.com/media2' },
    ];

    const mockDocuments = [
      {
        _id: new mongoose.Types.ObjectId(),
        title: 'Document 1',
        coordinates: mockCoordinate._id,
        stakeholders: [StakeholderEnum.LKAB],
        scale: '1:1000',
        type: mockType.id,
        date: '2024-01-01',
        language: 'EN',
        media: ['media1', 'media2'],
        summary: 'Summary 1',
        save: jest.fn(),

        toObject: jest.fn().mockReturnValue({
          title: 'Document 1',
          coordinates: mockCoordinate._id,
          stakeholders: [StakeholderEnum.LKAB],
          scale: '1:1000',
          type: mockType.id,
          date: '2024-01-01',
          language: 'EN',
          media: ['media1', 'media2'],
          summary: 'Summary 1',
        }),
      },
      {
        _id: new mongoose.Types.ObjectId(),
        title: 'Document 2',
        coordinates: '',
        stakeholders: [StakeholderEnum.Citizens],
        scale: '1:1000',
        type: mockType.id,
        date: '2024-01-02',
        language: 'EN',
        media: [],
        summary: 'Summary 2',
        save: jest.fn(),

        toObject: jest.fn().mockReturnValue({
          title: 'Document 2',
          coordinates: null,
          stakeholders: [StakeholderEnum.Citizens],
          scale: '1:1000',
          type: mockType.id,
          date: '2024-01-02',
          language: 'EN',
          media: null,
          summary: 'Summary 2',
        }),
      }
    ];

    //test 1
    test('Should return all documents with coordinates', async () => {
      //Support functions mocking
      (Document.find as jest.Mock).mockImplementation(async () => mockDocuments);
      jest.spyOn(require('../services/coordinate.service.ts'),'getCoordinateById')
        .mockResolvedValueOnce(mockCoordinate);
      jest.spyOn(require('../services/media.service'), 'fetchMedia')
        .mockResolvedValueOnce(mockMedia);
      jest.spyOn(require('../services/stakeholder.service'), 'fetchStakeholders')
        .mockResolvedValueOnce(mockDocuments[0].stakeholders)
        .mockResolvedValueOnce(mockDocuments[1].stakeholders);
      jest.spyOn(require("../services/documentType.service"), "fetchDocumentTypes")
        .mockResolvedValueOnce(mockType)
        .mockResolvedValueOnce(mockType);
      //There are 2 documents, so method must be called twice!
        
      //Call of getAllDocuments
      const result = await getAllDocuments();

      expect(getCoordinateById).toHaveBeenCalled();
      expect(fetchMedia).toHaveBeenCalled();
      expect(fetchStakeholders).toHaveBeenCalled();
      expect(fetchDocumentTypes).toHaveBeenCalledTimes(2);

      expect(result).toHaveLength(2);

      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('coordinates');
      expect(result[0]).toHaveProperty('media');
      expect(result[0]).toHaveProperty('stakeholders');
      expect(result[0]).toHaveProperty('type');
      expect(result[0].coordinates).toEqual(mockCoordinate);
      expect(result[0].media).toEqual(mockMedia);
      expect(result[0].stakeholders).toEqual([StakeholderEnum.Citizens]);
      expect(result[0].type).toEqual(mockType);
    });
  }); //getAllDocuments
  /* ************************************************** */

  //getDocumentById
  describe('Tests for getDocumentById', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    //Data mock
    const mockCoordinate = {
      _id: new mongoose.Types.ObjectId(),
      type: 'Point',
      coordinates: [45.123, 7.123],
      name: 'Test coordinate',
    };

    const mockMedia = [
      { id: 'media1', url: 'https://example.com/media1' },
      { id: 'media2', url: 'https://example.com/media2' },
    ];

    //2 documents are mocked to show that just one of them can be returned
    const mockDocuments = [
        {
          id: '1',
          title: 'Document 1',
          coordinates: mockCoordinate._id,
          stakeholders: ["st1"],
          scale: '1:1000',
          type: "ty1",
          date: '2024-01-01',
          language: 'EN',
          media: ['media1', 'media2'],
          summary: 'Summary 1',
          save: jest.fn(),

          toObject: jest.fn().mockReturnValue({
            title: 'Document 1',
            coordinates: mockCoordinate._id,
            stakeholders: ["st1"],
            scale: '1:1000',
            type: "ty1",
            date: '2024-01-01',
            language: 'EN',
            media: [],
            summary: 'Summary 1',
          })
      },
      {
        id: '2',
        title: 'Document 2',
        coordinates: '',
        stakeholders: ["st2"],
        scale: '1:1000',
        type: "ty2",
        date: '2024-01-02',
        language: 'EN',
        media: [],
        summary: 'Summary 2',
        save: jest.fn(),

        toObject: jest.fn().mockReturnValue({
          title: 'Document 2',
          coordinates: null,
          stakeholders: ["st2"],
          scale: '1:1000',
          type: "ty2",
          date: '2024-01-02',
          language: 'EN',
          media: null,
          summary: 'Summary 2',
        })
    }
    ];

    //test 1
    test('Should return document with its coordinates and medias', async () => {
      //Support functions mocking
      (Document.findById as jest.Mock).mockImplementation(async () => mockDocuments[0]);

      jest.spyOn(require('../services/coordinate.service.ts'), 'getCoordinateById')
        .mockResolvedValueOnce(mockCoordinate);
      jest.spyOn(require('../services/media.service'), 'fetchMedia')
        .mockResolvedValueOnce(mockMedia);
      jest.spyOn(require('../services/stakeholder.service'), 'fetchStakeholders')
        .mockResolvedValueOnce(StakeholderEnum.LKAB);
      jest.spyOn(require('../services/documentType.service'), 'fetchDocumentTypes')
        .mockResolvedValueOnce(DocTypeEnum.Agreement);

      //Call of getDocumentById
      const result = await getDocumentById('1');

      expect(Document.findById).toHaveBeenCalledWith('1');

      expect(getCoordinateById).toHaveBeenCalled();
      expect(fetchMedia).toHaveBeenCalled();
      expect(fetchStakeholders).toHaveBeenCalled();
      expect(fetchDocumentTypes).toHaveBeenCalled();

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('coordinates');
      expect(result).toHaveProperty('media');
      expect(result).toHaveProperty('stakeholders');
      expect(result).toHaveProperty('type');
      expect(result?.coordinates).toEqual(mockCoordinate);
      expect(result?.media).toEqual(mockMedia);
      expect(result?.stakeholders).toEqual(StakeholderEnum.LKAB);
      expect(result?.type).toEqual(DocTypeEnum.Agreement);
    });

    //test 2
    test('Should return document that has no coordinates or medias', async () => {
      //Support functions mocking
      (Document.findById as jest.Mock).mockImplementation(async () => mockDocuments[1]);

      jest.spyOn(require('../services/stakeholder.service'), 'fetchStakeholders')
        .mockResolvedValueOnce(StakeholderEnum.Citizens);
      jest.spyOn(require('../services/documentType.service'), 'fetchDocumentTypes')
        .mockResolvedValueOnce(DocTypeEnum.Conflict);

      //Call of getDocumentById
      const result = await getDocumentById('2');

      expect(Document.findById).toHaveBeenCalledWith('2');

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('coordinates');
      expect(result).toHaveProperty('media');
      expect(result).toHaveProperty('stakeholders');
      expect(result).toHaveProperty('type');
      expect(result?.stakeholders).toEqual(StakeholderEnum.Citizens);
      expect(result?.type).toEqual(DocTypeEnum.Conflict);
    });

    //test 3
    test('Should throw a DocNotFoundError', async () => {
      //Data mocking
      const err = new DocNotFoundError();

      //Support functions mocking
      (Document.findById as jest.Mock).mockImplementation(async () => null);

      //Call of getDocumentById
      await expect(getDocumentById('2')).rejects.toThrow(err);

      expect(Document.findById).toHaveBeenCalledWith('2');
    });
  }); //getDocumentById
  /* ************************************************** */

  //searchDocuments
  describe('Tests for searchDocuments', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    //Database data mock
    const mockCoordinate = {
      _id: new mongoose.Types.ObjectId().toString(),
      type: 'Point',
      coordinates: [45.123, 7.123],
      name: 'Test Coordinate',
    };

    const mockMedia = [
      { id: 'media1', url: 'https://example.com/media1' },
      { id: 'media2', url: 'https://example.com/media2' },
    ];

    const mockDocuments = [
      {
        id: '1',
        title: 'Test Document 1',
        summary: 'Summary 1',
        stakeholders: StakeholderEnum.ArchitectureFirms,
        scale: '1:500',
        type: DocTypeEnum.Agreement,
        date: '2000-01-01',
        language: 'EN',
        media: ['media1', 'media2'],
        coordinates: mockCoordinate._id,

        toObject: jest.fn().mockReturnValue({
          title: 'Test Document 1',
          summary: 'Summary 1',
          stakeholders: StakeholderEnum.ArchitectureFirms,
          scale: '1:500',
          type: DocTypeEnum.Agreement,
          date: '2000-01-01',
          language: 'EN',
          media: ['media1', 'media2'],
          coordinates: mockCoordinate._id
        }),
      },
      {
        id: '2',
        title: 'Test Document 2',
        summary: 'Summary 2',
        stakeholders: [StakeholderEnum.Citizens, StakeholderEnum.LKAB],
        scale: ScaleTypeEnum.Architectural,
        type: DocTypeEnum.Conflict,
        date: '2000-01-02',
        language: 'EN',
        media: [],
        coordinates: '',

        toObject: jest.fn().mockReturnValue({
          title: 'Test Document 2',
          summary: 'Summary 2',
          stakeholders: [StakeholderEnum.Citizens, StakeholderEnum.LKAB],
          scale: ScaleTypeEnum.Architectural,
          type: DocTypeEnum.Conflict,
          date: '2000-01-02',
          language: 'EN',
          media: [],
          coordinates: ''
        }),
      },
    ];

    //test 1
    test('Should return searched documents and relative coordinates and media (if there are any)', async () => {
      //Input mock
      const filters = {
        stakeholders: [StakeholderEnum.ArchitectureFirms],
        scale: ScaleTypeEnum.Architectural,
        architecturalScale: "Test value",
        type: DocTypeEnum.Agreement,
        date: "2000-01-01",
        language: "EN"
      } as unknown as IDocumentFilters;

      //Support functions mocking
      (Document.find as jest.Mock).mockImplementation(async () => [mockDocuments[0]]);

      (getCoordinateById as jest.Mock).mockImplementation(async () => mockCoordinate);
      jest.spyOn(require('../services/media.service'), 'fetchMedia')
        .mockResolvedValueOnce(mockMedia);
      jest.spyOn(require('../services/stakeholder.service'), 'fetchStakeholders')
        .mockResolvedValueOnce(StakeholderEnum.ArchitectureFirms);
      jest.spyOn(require('../services/documentType.service'), 'fetchDocumentTypes')
        .mockResolvedValueOnce(DocTypeEnum.Agreement);

      //Call of searchDocuments
      //In order to navigate each if-else block of searchDocuments, all possible filters are added
      const result = await searchDocuments(['Test Document 1'], filters);

      expect(Document.find).toHaveBeenCalled();

      expect(fetchMedia).toHaveBeenCalled();
      expect(getCoordinateById).toHaveBeenCalledWith(mockCoordinate._id);
      expect(fetchStakeholders).toHaveBeenCalled();
      expect(fetchDocumentTypes).toHaveBeenCalled();

      expect(result).toEqual([
        {
          id: '1',
          title: 'Test Document 1',
          summary: 'Summary 1',
          stakeholders: StakeholderEnum.ArchitectureFirms,
          scale: '1:500',
          type: DocTypeEnum.Agreement,
          date: '2000-01-01',
          language: 'EN',
          media: mockMedia,
          coordinates: mockCoordinate,
        },
      ]);
    });

    //test 2
    test('Should return a document with multiple stakeholders if some/ all of these are given', async () => {
      //Input mock
      const filters = {
        stakeholders: [StakeholderEnum.Citizens, StakeholderEnum.LKAB]
      } as unknown as IDocumentFilters;

      //Support functions mocking
      (Document.find as jest.Mock).mockImplementation(async () => [mockDocuments[1]]);

      jest.spyOn(require('../services/stakeholder.service'), 'fetchStakeholders')
        .mockResolvedValueOnce([StakeholderEnum.Citizens, StakeholderEnum.LKAB]);
      jest.spyOn(require('../services/documentType.service'), 'fetchDocumentTypes')
        .mockResolvedValueOnce(DocTypeEnum.Conflict);

      //Call of searchDocuments
      const result = await searchDocuments([], filters);

      expect(Document.find).toHaveBeenCalled();

      expect(fetchStakeholders).toHaveBeenCalled();
      expect(fetchDocumentTypes).toHaveBeenCalled();

      expect(result).toEqual([
        {
          id: '2',
          title: 'Test Document 2',
          summary: 'Summary 2',
          stakeholders: [StakeholderEnum.Citizens, StakeholderEnum.LKAB],
          scale: ScaleTypeEnum.Architectural,
          type: DocTypeEnum.Conflict,
          date: '2000-01-02',
          language: 'EN',
          media: null,
          coordinates: null
        },
      ]);
    });

    //test 3
    test('Given a coordionate, the relative document is returned (with its attachments)', async () => {
      //Input mock
      const filters = {
        coordinates: mockCoordinate._id
      } as unknown as IDocumentFilters;

      //Support functions mocking
      (Document.find as jest.Mock).mockImplementation(async () => [mockDocuments[0]]);

      (getCoordinateById as jest.Mock).mockImplementation(async () => mockCoordinate);
      jest.spyOn(require('../services/media.service'), 'fetchMedia')
        .mockResolvedValueOnce(mockMedia);
      jest.spyOn(require('../services/stakeholder.service'), 'fetchStakeholders')
        .mockResolvedValueOnce(StakeholderEnum.ArchitectureFirms);
      jest.spyOn(require('../services/documentType.service'), 'fetchDocumentTypes')
        .mockResolvedValueOnce(DocTypeEnum.Agreement);

      //Call of searchDocuments
      const result = await searchDocuments(['Test Document 1'], filters);

      expect(Document.find).toHaveBeenCalled();

      expect(fetchMedia).toHaveBeenCalled();
      expect(getCoordinateById).toHaveBeenCalledWith(mockCoordinate._id);
      expect(fetchStakeholders).toHaveBeenCalled();
      expect(fetchDocumentTypes).toHaveBeenCalled();

      expect(result).toEqual([
        {
          id: '1',
          title: 'Test Document 1',
          summary: 'Summary 1',
          stakeholders: StakeholderEnum.ArchitectureFirms,
          scale: '1:500',
          type: DocTypeEnum.Agreement,
          date: '2000-01-01',
          language: 'EN',
          media: mockMedia,
          coordinates: mockCoordinate,
        },
      ]);
    });

    //test 4
    test('Should return an empty array if no documents match', async () => {
      //Support functions mocking
      (Document.find as jest.Mock).mockImplementation(async () => []);

      //Call of searchDocuments
      const result = await searchDocuments(['randomText']);

      expect(Document.find).toHaveBeenCalledWith({
        $and: [
          {
            $or: [
              { title: { $regex: 'randomText', $options: 'i' } },
              { summary: { $regex: 'randomText', $options: 'i' } },
            ],
          },
        ],
      });

      expect(result).toEqual([]);
    });
  }); //searchDocuments
  /* ************************************************** */

  //updatingDocument
  describe('Tests for updatingDocument', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    //Data mock
    const mockDocument = {
      id: '1',
      title: 'Test Document',
      stakeholders: ["sh1"],
      scale: 'Test value',
      architecturalScale: 'Test value',
      type: "ty1",
      date: '2000-01-01',
      connections: [],
      language: 'EN',
      media: ['media1', 'media2'],
      coordinates: '1',
      summary: 'Test summary'
    };

    const mockUpdatedDocument = {
      ...mockDocument,
      title: 'Test document updated',
      summary: 'Test updated summary',
      scale: ScaleTypeEnum.BlueprintMaterialEffects,
      connections: [{document: 'cd1'}]
    };

    //Just essentials data are filled in this fake document
    const mockConnectedDoc = {
      id: 'cd1',
      connections: [{document: 'testId'}],
      save: jest.fn(),
      toObject: jest.fn().mockReturnValue(this)
    } as unknown as IDocument;

    const mockCoordinate = {
      _id: '1',
      type: 'Point',
      coordinates: [45.123, 7.123],
      name: 'Test Coordinate',
    };

    const mockMedia = [
      { id: 'media1', url: 'https://example.com/media1' },
      { id: 'media2', url: 'https://example.com/media2' },
    ];

    //test 1
    test('Should update the description of a document', async () => {
      //Support functions mocking
      jest.spyOn(Document, 'findByIdAndUpdate').mockResolvedValue({
        ...mockUpdatedDocument,
        toObject: () => mockUpdatedDocument,
        save: jest.fn()
      });

      //The "save" method is not mocked because it was append to the object in the previous code line
      (Document.findById as jest.Mock).mockImplementation(async() => mockConnectedDoc);
      (Document.prototype.save as jest.Mock).mockImplementation(async() => mockConnectedDoc);
      jest.spyOn(require("../services/coordinate.service"), "getCoordinateById")
        .mockResolvedValue(mockCoordinate);
      jest.spyOn(require("../services/media.service"), "fetchMedia")
        .mockResolvedValueOnce(mockMedia);
      (DocumentType.findById as jest.Mock).mockImplementation(async() => DocTypeEnum.Agreement);
      jest.spyOn(require("../services/stakeholder.service"), "fetchStakeholders")
        .mockResolvedValueOnce(StakeholderEnum.Citizens);
      jest.spyOn(require("../services/documentType.service"), "fetchDocumentTypes")
        .mockResolvedValueOnce(DocTypeEnum.Agreement);
      
      //Call of updatingDocument
      const result = await updatingDocument('1', {
        title: 'Test document updated',
        scale: ScaleTypeEnum.BlueprintMaterialEffects,
        summary: 'Test updated summary',
        connections: [{document: 'cd1'} as unknown as IConnection]
      });

      expect(Document.findByIdAndUpdate).toHaveBeenCalled();
      expect(Document.findById).toHaveBeenCalledWith('cd1');
      expect(DocumentType.findById).toHaveBeenCalledWith("ty1");

      expect(getCoordinateById).toHaveBeenCalledWith("1");
      expect(fetchMedia).toHaveBeenCalled();
      expect(fetchStakeholders).toHaveBeenCalled();
      expect(fetchDocumentTypes).toHaveBeenCalled();

      expect(result).toEqual({
        id: '1',
        title: 'Test document updated',
        stakeholders: StakeholderEnum.Citizens,
        scale: ScaleTypeEnum.BlueprintMaterialEffects,
        architecturalScale: 'Test value',
        type: DocTypeEnum.Agreement,
        date: '2000-01-01',
        connections: [{document: 'cd1'}],
        language: 'EN',
        media: mockMedia,
        coordinates: mockCoordinate,
        summary: 'Test updated summary'
      } as unknown as IDocument);
    });

    //test 2
    test('Should throw DocNotFoundError', async () => {
      //Mocked datas
      const err = new DocNotFoundError();

      //Support functions mocking
      (Document.findByIdAndUpdate as jest.Mock).mockImplementation(async () => null);

      //Call of updatingDocument
      await expect(updatingDocument('100', { title: 'Test title updated' })).rejects.toThrow(err);

      expect(Document.findByIdAndUpdate).toHaveBeenCalledWith(
        '100',
        { title: 'Test title updated' },
        {
          new: true,
          runValidators: true,
        },
      );
    });

    //test 3
    test('Should update a coordinate related to a document', async () => {
      //Mocked data
      const updateCoordinate = { coordinates: '1' };

      //Support functions mocking
      jest.spyOn(Document, 'findByIdAndUpdate').mockResolvedValue({
        ...mockDocument,
        toObject: () => mockDocument,
      });
      jest.spyOn(require("../services/coordinate.service"), "getCoordinateById")
        .mockResolvedValue(mockCoordinate);
      jest.spyOn(require("../services/media.service"), "fetchMedia")
        .mockResolvedValueOnce(mockMedia);
      jest.spyOn(require("../services/stakeholder.service"), "fetchStakeholders")
        .mockResolvedValueOnce(StakeholderEnum.Citizens);
      jest.spyOn(require("../services/documentType.service"), "fetchDocumentTypes")
        .mockResolvedValueOnce(DocTypeEnum.Agreement);

      //Call of updatingDocument
      const result = await updatingDocument(
        '1',
        updateCoordinate as unknown as Partial<IDocument>,
      );

      expect(Coordinate.findById).toHaveBeenCalledWith('1');

      expect(getCoordinateById).toHaveBeenCalledWith("1");
      expect(fetchMedia).toHaveBeenCalled();
      expect(fetchStakeholders).toHaveBeenCalled();
      expect(fetchDocumentTypes).toHaveBeenCalled();

      expect(result).toEqual({
        id: '1',
        title: 'Test Document',
        stakeholders: StakeholderEnum.Citizens,
        scale: 'Test value',
        architecturalScale: 'Test value',
        type: DocTypeEnum.Agreement,
        date: '2000-01-01',
        connections: [],
        language: 'EN',
        media: mockMedia,
        coordinates: {
          _id: '1',
          type: 'Point',
          coordinates: [45.123, 7.123],
          name: 'Test Coordinate',
        },
        summary: 'Test summary',
      });
    });

    //test 4
    test('Should update a media related to a document that alredy have some', async () => {
      //Mocked data
      const updateMedia = { media: ['media3'] };
      //On purpose is chosen a new media id
      //This coiche is made to test also the case where a new related media (to the document) is added

      //Support functions mocking
      jest.spyOn(Document, 'findByIdAndUpdate').mockResolvedValueOnce({
        ...mockDocument,
        toObject: () => mockDocument,
      });
      (MediaDocument.findById as jest.Mock).mockImplementation(async () => mockMedia);
      jest.spyOn(require("../services/coordinate.service"), "getCoordinateById")
        .mockResolvedValueOnce(mockCoordinate);
      jest.spyOn(require("../services/media.service"), "fetchMedia")
        .mockResolvedValueOnce(mockMedia);
      jest.spyOn(require("../services/stakeholder.service"), "fetchStakeholders")
        .mockResolvedValueOnce(StakeholderEnum.Citizens);
      jest.spyOn(require("../services/documentType.service"), "fetchDocumentTypes")
        .mockResolvedValueOnce(DocTypeEnum.Agreement);

      //Call of updatingDocument
      const result = await updatingDocument(
        '1',
        updateMedia as unknown as Partial<IDocument>,
      );

      expect(Media.findById).toHaveBeenCalledWith('media3');

      expect(fetchMedia).toHaveBeenCalled();
      expect(fetchStakeholders).toHaveBeenCalled();
      expect(fetchDocumentTypes).toHaveBeenCalled();

      expect(result).toEqual({
        id: '1',
        title: 'Test Document',
        stakeholders: StakeholderEnum.Citizens,
        scale: 'Test value',
        architecturalScale: 'Test value',
        type: DocTypeEnum.Agreement,
        date: '2000-01-01',
        connections: [],
        language: 'EN',
        media: mockMedia,
        coordinates: {
          _id: '1',
          type: 'Point',
          coordinates: [45.123, 7.123],
          name: 'Test Coordinate',
        },
        summary: 'Test summary',
      });
    });

    //test 5 - this test is needed to test all the possible branches of a method code line
    test('Should update a media related to a document that does not have any', async () => {
      //Mocked data
      const mockNoMediaDoc = {
        id: '100',
        title: 'No media document',
        stakeholders: ["sh1"],
        scale: 'Test value',
        architecturalScale: 'Test value',
        type: "ty1",
        date: '2000-01-02',
        connections: [],
        language: 'EN',
        media: null,
        coordinates: '',
        summary: 'A document without medias'
      };

      const updateMedia = { media: ['media3'] };

      //Support functions mocking
      jest.spyOn(Document, 'findByIdAndUpdate').mockResolvedValueOnce({
        ...mockNoMediaDoc,
        toObject: () => mockNoMediaDoc,
      });
      (MediaDocument.findById as jest.Mock).mockImplementation(async () => mockMedia);
      jest.spyOn(require("../services/media.service"), "fetchMedia")
        .mockResolvedValueOnce(mockMedia);
      jest.spyOn(require("../services/stakeholder.service"), "fetchStakeholders")
        .mockResolvedValueOnce(StakeholderEnum.Citizens);
      jest.spyOn(require("../services/documentType.service"), "fetchDocumentTypes")
        .mockResolvedValueOnce(DocTypeEnum.Agreement);
        
      //Call of updatingDocument
      const result = await updatingDocument('100', updateMedia as unknown as Partial<IDocument>);

      expect(Media.findById).toHaveBeenCalledWith('media3');

      expect(fetchMedia).toHaveBeenCalled();
      expect(fetchStakeholders).toHaveBeenCalled();
      expect(fetchDocumentTypes).toHaveBeenCalled();

      expect(result).toEqual({
        id: '100',
        title: 'No media document',
        stakeholders: StakeholderEnum.Citizens,
        scale: 'Test value',
        architecturalScale: 'Test value',
        type: DocTypeEnum.Agreement,
        date: '2000-01-02',
        connections: [],
        language: 'EN',
        media: mockMedia,
        coordinates: null,
        summary: 'A document without medias',
      });
    });

    //test 6
    test('Should throw PositionError', async () => {
      //Mocked data
      const updateCoordinate = { coordinates: '2' };
      const err = new PositionError();

      //Support functions mocking
      jest.spyOn(Document, 'findByIdAndUpdate').mockResolvedValue({
        ...mockDocument,
        toObject: () => mockDocument,
      });
      (Coordinate.findById as jest.Mock).mockImplementation(async () => null);

      //Call of updatingDocument
      await expect(
        updatingDocument(
          '1',
          updateCoordinate as unknown as Partial<IDocument>,
        ),
      ).rejects.toThrow(err);

      expect(Coordinate.findById).toHaveBeenCalledWith('2');
    });

    //test 7
    test('Should throw MediaNotFoundError', async () => {
      //Mocked data
      const updateMedia = { media: ['media3'] };
      const err = new MediaNotFoundError();

      //Support functions mocking
      jest.spyOn(Document, 'findByIdAndUpdate').mockResolvedValue({
        ...mockDocument,
        toObject: () => mockDocument,
      });
      (MediaDocument.findById as jest.Mock).mockImplementation(
        async () => null,
      );

      //Call of updatingDocument
      await expect(
        updatingDocument('1', updateMedia as unknown as Partial<IDocument>),
      ).rejects.toThrow(err);

      expect(MediaDocument.findById).toHaveBeenCalledWith('media3');
    });

    //test 8
    test('Should throw DocNotFoundError, but when a connected document is searched', async () => {
      //Mocked datas
      const err = new DocNotFoundError();

      //Support functions mocking
      (Document.findByIdAndUpdate as jest.Mock).mockImplementation(async () => mockDocument);
      (Document.findById as jest.Mock).mockImplementation(async () => null);

      //Call of updatingDocument
      await expect(updatingDocument('1', { connections: [{document: "100"} as unknown as IConnection] })).rejects.toThrow(err);

      expect(Document.findByIdAndUpdate).toHaveBeenCalledWith(
        '1',
        { connections: [{document: "100"} as unknown as IConnection] },
        {
          new: true,
          runValidators: true,
        }
      );
      expect(Document.findById).toHaveBeenCalled()
    });

    //test 9
    test('Should throw StakeholderNotFoundError', async () => {
      //Mocked data
      const wrongShId = new mongoose.Types.ObjectId();
      const err = new StakeholderNotFoundError();

      //Support functions mocking
      jest.spyOn(Document, 'findByIdAndUpdate').mockResolvedValue({
        ...mockDocument,
        toObject: () => mockDocument,
      });
      (Stakeholder.findById as jest.Mock).mockImplementation(async() => null);

      //Call of updatingDocument
      await expect(
        updatingDocument('1', {stakeholders: [wrongShId as unknown as ObjectId]})
      ).rejects.toThrow(err);

      expect(Document.findByIdAndUpdate).toHaveBeenCalled();
      expect(Stakeholder.findById).toHaveBeenCalled();
    });

    //test 10
    test('Should throw an error if the same stakeholder is added more than once', async () => {
      //Mocked data
      const duplicateShId = "sh2";

      const mockWrongUpdatedDoc = {
        id: '2',
        title: 'Test Document 2',
        stakeholders: [duplicateShId, duplicateShId],
        scale: 'Test value 2',
        architecturalScale: 'Test value 2.2',
        type: "ty1",
        date: '2000-01-01',
        connections: [],
        language: 'EN',
        media: [],
        coordinates: '',
        summary: 'Test summary 2'
      };

      const err = new Error("Duplicate stakeholderID found");

      //Support functions mocking
      jest.spyOn(Document, 'findByIdAndUpdate').mockResolvedValue({
        ...mockWrongUpdatedDoc,
        toObject: () => mockWrongUpdatedDoc
      });
      (Stakeholder.findById as jest.Mock).mockImplementation(async() => StakeholderEnum.LKAB);

      //Call of updatingDocument
      await expect(
        updatingDocument('1', {title: "Text to trigger the method"})
      ).rejects.toThrow(err);

      expect(Document.findByIdAndUpdate).toHaveBeenCalled();
      expect(Stakeholder.findById).toHaveBeenCalled();
    });

    //test 11
    test('Should throw DocumentTypeNotFoundError', async () => {
      //Mocked data
      const err = new DocumentTypeNotFoundError();

      //Support functions mocking
      jest.spyOn(Document, 'findByIdAndUpdate').mockResolvedValue({
        ...mockDocument,
        toObject: () => mockDocument
      });
      (Stakeholder.findById as jest.Mock).mockImplementation(async() => StakeholderEnum.LKAB);
      (DocumentType.findById as jest.Mock).mockImplementation(async() => null);

      //Call of updatingDocument
      await expect(
        updatingDocument('1', {title: "Text to trigger the method"})
      ).rejects.toThrow(err);

      expect(Document.findByIdAndUpdate).toHaveBeenCalled();
      expect(Stakeholder.findById).toHaveBeenCalled();
      expect(DocumentType.findById).toHaveBeenCalled();
    });
  }); //updatingDocument
  /* ************************************************** */

  //deleteDocumentByName won't be tested because the application doesn't use it (it was created for experiments purposes)
  /* ************************************************** */

  //getDocumentTypes
  describe('Tests for getDocumentTypes', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    //An example of default types + new ones created by a user
    const mockDBTypes = [
      {_id: "1", type: "test type 1"},
      {_id: "2", type: "test type 2"},
      {_id: "3", type: DocTypeEnum.Agreement},
      {_id: "4", type: DocTypeEnum.Conflict}
    ]

    //test 1
    test('Should retrieve all documents types', async () => {
      //Support functions mocking
      jest.spyOn(DocumentType, 'find').mockResolvedValueOnce(mockDBTypes);
      
      //Call of getDocumentTypes
      const result = await getDocumentTypes();

      expect(DocumentType.find).toHaveBeenCalled();
      expect(result).toEqual([
        {value: "1", label: "test type 1"},
        {value: "2", label: "test type 2"},
        {value: "3", label: DocTypeEnum.Agreement},
        {value: "4", label: DocTypeEnum.Conflict}
      ]);
    });

    //test 2
    test('Should throw a DocumentTypeNotFoundError', async () => {
      //Data mock
      const err = new DocumentTypeNotFoundError();

      //Support functions mocking
      (DocumentType.find as jest.Mock).mockImplementation(async() => []);
      
      //Call of getDocumentTypes + check
      expect(getDocumentTypes()).rejects.toThrow(err);
      expect(DocumentType.find).toHaveBeenCalled();
    });
  }); //getDocumentTypes
  /* ************************************************** */

  //getDocumentByType
  describe('Tests for getDocumentByType', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    //Mocked data
    const mockedType = {
      _id: "ty1",
      type: DocTypeEnum.Agreement
    }

    //Just essential fields are filled
    const mockDocuments = [
      {
        id: "d1",
        title: "Document 1",
        summary: "Test document 1",
        stakeholders: ["st1"],
        coordinates: "c1",
        media: ["m1", "m2"],
        type: mockedType._id
      },
      {
        id: "d2",
        title: "Document 2",
        summary: "Test document 2",
        stakeholders: ["st2", "st3"],
        coordinates: null,
        media: [],
        type: mockedType._id
      }
    ];

    const mockCoordinate = {
      id: 'c1',
      type: 'Point',
      coordinates: [12.345, 67.890],
      name: 'Test Coordinate'
    };

    const mockMedias = [
      { id: "m1", url: "https://example.com/media1" },
      { id: "m2", url: "https://example.com/media2" }
    ];

    //test 1
    test("Should return all the documents of the specified type", async () => {
      //Support functions mocking
      jest.spyOn(DocumentType, 'findById').mockResolvedValueOnce(mockedType);

      (Document.find as jest.Mock).mockImplementation(() => ({
        select: jest.fn().mockImplementation(async() =>
          mockDocuments.map((doc) => ({
            ...doc,
            toObject: () => doc
          }))
        )
      }));

      (getCoordinateById as jest.Mock).mockImplementation(async() => mockCoordinate);
      jest.spyOn(require("../services/media.service"), "getMediaMetadataById")
       .mockResolvedValueOnce(mockMedias[0])
       .mockResolvedValueOnce(mockMedias[1])
      jest.spyOn(require("../services/stakeholder.service"), "fetchStakeholders")
        .mockResolvedValueOnce(StakeholderEnum.LKAB)
        .mockResolvedValueOnce([StakeholderEnum.Citizens, StakeholderEnum.RegionalAuthority]);
      jest.spyOn(require("../services/documentType.service"), 'fetchDocumentTypes')
        .mockResolvedValueOnce({
          id: 'ty1',
          type: DocTypeEnum.Agreement
        })
        .mockResolvedValueOnce({
          id: 'ty1',
          type: DocTypeEnum.Agreement
        }); //fetchDocumentTypes must be called 2 times because the mocked documents are 2

      //Call of getDocumentByType
      const result = await getDocumentByType(DocTypeEnum.Agreement);

      expect(DocumentType.findById).toHaveBeenCalledWith(DocTypeEnum.Agreement);
      expect(Document.find).toHaveBeenCalled();
      expect(getCoordinateById).toHaveBeenCalledWith("c1");
      expect(getMediaMetadataById).toHaveBeenCalledTimes(2);
      expect(fetchStakeholders).toHaveBeenCalledTimes(2);
      expect(fetchDocumentTypes).toHaveBeenCalledTimes(2);

      expect(result).toEqual([
        {
          id: 'd1',
          title: 'Document 1',
          summary: 'Test document 1',
          stakeholders: [StakeholderEnum.Citizens, StakeholderEnum.RegionalAuthority],
          coordinates: mockCoordinate,
          media: [mockMedias[0], mockMedias[1]],
          type: {
            id: "ty1",
            type: DocTypeEnum.Agreement
          }
        },
        {
          id: 'd2',
          title: 'Document 2',
          summary: 'Test document 2',
          stakeholders: StakeholderEnum.LKAB,
          coordinates: null,
          media: null,
          type: {
            id: "ty1",
            type: DocTypeEnum.Agreement
          }
        }
      ]);
    });

    //test 2
    test('Should throw a DocumentTypeNotFoundError', async () => {
      //Data mock
      const err = new DocumentTypeNotFoundError();

      //Support functions mocking
      (DocumentType.findById as jest.Mock).mockImplementation(async () => null);

      //Call of getDocumentByType
      await expect(getDocumentByType('wrongType')).rejects.toThrow(err);

      expect(DocumentType.findById).toHaveBeenCalledWith('wrongType');
    });

    //test 3
    test('Should throw a DocNotFoundError if the input type does not match any document', async () => {
      //Data mock
      const err = new DocNotFoundError();

      //Support functions mocking
      (DocumentType.findById as jest.Mock).mockImplementation(async () => mockedType);
      (Document.find as jest.Mock).mockImplementation(() => ({
          select: jest.fn().mockImplementation(async() => [])
        })
      );

      //Call of getDocumentByType
      await expect(getDocumentByType(DocTypeEnum.Agreement)).rejects.toThrow(err);

      expect(DocumentType.findById).toHaveBeenCalledWith(DocTypeEnum.Agreement);
      expect(Document.find).toHaveBeenCalled();
    });
  }); //getDocumentByType
  /* ************************************************** */
}); //END OF DOCUMENT SERVICES

/* ******************************************* Suite n#4 - MEDIA ******************************************* */
describe('Tests for media services', () => {
  //getTypeFromMimeType
  describe('Tests for getTypeFromMimeType', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    //test 1
    test('Should return "image" for all images mimetypes', async () => {
      expect(getTypeFromMimeType('image/jpeg')).toBe('image');
      expect(getTypeFromMimeType('image/png')).toBe('image');
      expect(getTypeFromMimeType('image/gif')).toBe('image');
    });

    //test 2
    test('Should return "document" for the mimetype application/pdf', () => {
      expect(getTypeFromMimeType('application/pdf')).toBe('document');
    });

    //test 3
    test('Should return "text" for all text/ mimetypes', () => {
      expect(getTypeFromMimeType('text/plain')).toBe('text');
      expect(getTypeFromMimeType('text/html')).toBe('text');
      expect(getTypeFromMimeType('text/css')).toBe('text');
    });

    //test 4
    test('Should return "unknown" for unsupported, empty or invalid mimetypes', () => {
      expect(getTypeFromMimeType('application/json')).toBe('unknown');
      expect(getTypeFromMimeType('video/mp4')).toBe('unknown');
      expect(getTypeFromMimeType('audio/mpeg')).toBe('unknown');
      expect(getTypeFromMimeType('')).toBe('unknown');
      expect(getTypeFromMimeType('invalid/mimetype')).toBe('unknown');
    });
  }); //getTypeFromMimeType
  /* ************************************************** */

  //uploadMediaService
  describe('Tests for uploadMediaService', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    //Data mock
    const mediaData = {
      filename: 'example.jpg',
      mimeType: 'image/jpeg',
      size: 1024,
      userId: '123',
      folder: 'test-folder',
    };

    const mockPresignedUrl: IReturnPresignedUrl = {
      url: 'https://cdn.example.com/presigned-url',
    };
    const mockFileMetadata: Partial<IMedia> = {
      relativeUrl: '/uploads/example.jpg',
    };

    //test 1
    test('Should successfully upload a media', async () => {
      //Data mock
      const newMedia = {
        _id: '1',
        filename: mediaData.filename,
        relativeUrl: mockFileMetadata.relativeUrl,
        type: 'image',
        mimetype: mediaData.mimeType,
        size: mediaData.size,
        user: mediaData.userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockFetchedObj: Response = {
        ok: true,
        json: async () => ({
          presignedUrl: mockPresignedUrl,
          fileMetadata: mockFileMetadata,
        }),
      } as Response;

      //Support functions mocking
      (fetch as jest.Mock).mockImplementation(async () => mockFetchedObj);

      jest
        .spyOn(require('@services/media.service'), 'getTypeFromMimeType')
        .mockResolvedValue('image');

      (Media.prototype.save as jest.Mock).mockImplementation(
        async () => newMedia
      );

      //Call of uploadMediaService
      const result = await uploadMediaService(mediaData);

      expect(result).toEqual(mockPresignedUrl);
      expect(fetch).toHaveBeenCalled();
      expect(getTypeFromMimeType).toBeCalled();
      expect(Media.prototype.save).toHaveBeenCalled();
    });

    //test 2
    test('Should throw an error', async () => {
      //Data mock
      const err = new CustomError('Internal Server Error', 400);

      const mockFetchedObj: Response = {
        ok: false,
      } as Response;

      //Support functions mocking
      (fetch as jest.Mock).mockImplementation(async () => mockFetchedObj);

      //Call of uploadMediaService + error check
      await expect(uploadMediaService(mediaData)).rejects.toThrow(err);

      expect(fetch).toHaveBeenCalled();
      expect(getTypeFromMimeType).not.toBeCalled();
      expect(Media.prototype.save).not.toHaveBeenCalled();
    });
  }); //uploadMediaService
  /* ************************************************** */

  //updateMediaMetadata
  describe('Tests for updateMediaMetadata', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    //test 1
    test('Should successfully update a media', async () => {
      //Data mock
      const mediaId = '1';
      const metadata = { pages: 10, size: 2048 };
      const mockUpdatedMedia = { id: mediaId, ...metadata };

      //Support functions mocking
      (Media.findByIdAndUpdate as jest.Mock).mockImplementation(
        async () => mockUpdatedMedia,
      );

      //Call of updateMediaMetadata
      await updateMediaMetadata(mediaId, metadata);

      expect(Media.findByIdAndUpdate).toHaveBeenCalledWith(
        mediaId,
        { $set: { pages: 10, size: 2048 } },
        { new: true },
      );
    });

    //test 2
    test("Should throw a CustomError", async () => {
      //Data mock
      const mediaId = "1";

      //An empty input will trigger the error
      const metadata = {};
      const err = new CustomError('No fields to update', 400);
  
      //Call of updateMediaMetadata + error throwing check
      await expect(updateMediaMetadata(mediaId, [])).rejects.toThrow(err);
  
      expect(Media.findByIdAndUpdate).not.toHaveBeenCalled();
    });

    //test 3
    test('Should throw a MediaNotFounderror', async () => {
      //Data mock
      const mediaId = '100';
      const metadata = { pages: 10, size: 2048 };
      const err = new MediaNotFoundError();

      //Support functions mocking
      (Media.findByIdAndUpdate as jest.Mock).mockImplementation(
        async () => null,
      );

      //Call of updateMediaMetadata + error throwing check
      await expect(updateMediaMetadata(mediaId, metadata)).rejects.toThrow(err);

      expect(Media.findByIdAndUpdate).toHaveBeenCalled();
    });
  }); //updateMediaMetadata
  /* ************************************************** */

  //getMediaMetadataById
  describe('Tests for getMediaMetadataById', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    //Data mock
    const mockMedia = {
      id: "media1",
      filename: "test.pdf",
      relativeUrl: "example/url",
      type: "document",
      mimetype: "application/pdf",
      pages: 10
    };

    //test 1
    test("Should return the media metadata", async () => {
      //Support functions mocking
      (Media.findById as jest.Mock).mockImplementation(async() => mockMedia);
  
      //Call of getMediaMetadataById
      const result = await getMediaMetadataById("media1");
  
      expect(Media.findById).toHaveBeenCalledWith("media1");
      expect(result).toEqual({
        id: mockMedia.id,
        filename: mockMedia.filename,
        url: mockMedia.relativeUrl,
        type: mockMedia.type,
        mimetype: mockMedia.mimetype,
        pages: mockMedia.pages
      });
    });
  
    //test 2
    test("Should throw an error if the media is not found", async () => {
      //Data mock
      const err = new Error("Media not found");
      
      //Support functions mock
      (Media.findById as jest.Mock).mockImplementation(async() => null);
  
      //Call of getMediaMetadataById + result check
      await expect(getMediaMetadataById("invalid-id")).rejects.toThrowError(err);
      expect(Media.findById).toHaveBeenCalledWith("invalid-id");
    });
  }); //getMediaMetadataById
  /* ************************************************** */

  //fetchMedia
  describe('Tests for fetchMedia', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    //Data mock
    const mockMedias = [
      { id: "media1", url: "https://example.com/media1" },
      { id: "media2", url: "https://example.com/media2" }
    ]

    //test 1
    test("It should return null if no ids are given as an input", async () => {
      //Call of fetchMedia
      const result = await fetchMedia([]);

      expect(result).toBeNull();
    });

    //test 2
    test("Should return the asked medias", async () => {
      //Input mock
      const mediaIds = ["media1", "media2"] as unknown as ObjectId[];
      
      //Support functions mocking
      jest.spyOn(require("../services/media.service"), "getMediaMetadataById" )
        .mockResolvedValueOnce(mockMedias[0])
        .mockResolvedValueOnce(mockMedias[1]);
  
      //Call of fetchMedia
      const result = await fetchMedia(mediaIds as unknown as ObjectId[]);
  
      expect(getMediaMetadataById).toHaveBeenCalledTimes(mediaIds.length);
      expect(getMediaMetadataById).toHaveBeenCalledWith("media1");
      expect(getMediaMetadataById).toHaveBeenCalledWith("media2");
      expect(result).toEqual([
        { id: "media1", url: "https://example.com/media1" },
        { id: "media2", url: "https://example.com/media2" },
      ]);
    });
  }); //fetchMedia
  /* ************************************************** */
}); //END OF MEDIA SERVICES

/* ******************************************* Suite n#5 - GRAPH ******************************************* */
describe('Tests for graph services', () => {
  //getGraphDatas
  describe('Tests for getGraphDatas', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    //Returned data mock
    const mockAggregate = jest.fn().mockImplementation(async() => [
      {
        minYear: '2010',
        maxYear: '2020',
        data: [
          {
            year: '2010',
            type: [
              { scale: 'scale1', qty: 5 },
              { scale: 'scale2', qty: 3 },
            ],
          },
          {
            year: '2020',
            type: [
              { scale: 'scale1', qty: 7 },
              { scale: 'scale2', qty: 2 },
            ],
          },
        ],
      },
    ]);

    //test 1
    test('Should retrive all the data needed to build the graph', async () => {
      //Support functions mocking
      (Document.aggregate as jest.Mock).mockImplementation(mockAggregate);

      //Call of getGraphDatas
      const result = await getGraphDatas();

      expect(result).toEqual({
        minYear: '2010',
        maxYear: '2020',
        infoYear: [
          {
            year: '2010',
            types: [
              { scale: 'scale1', qty: 5 },
              { scale: 'scale2', qty: 3 },
            ],
          },
          {
            year: '2020',
            types: [
              { scale: 'scale1', qty: 7 },
              { scale: 'scale2', qty: 2 },
            ],
          },
        ],
      });

      expect(Document.aggregate).toHaveBeenCalled();
    });

    //test 2
    test('Should throw an error if the connection fails', async () => {
      //Data mock
      const err = new CustomError("Internal Server Error", 500);

      //Support functions mocking
      (Document.aggregate as jest.Mock).mockImplementation(async() => err);
  
      //Call of getGraphDatas + result checks
      await expect(getGraphDatas()).rejects.toThrow(err);
    });
  }); //getGraphDatas
  /* ************************************************** */
}) //END OF GRAPH SERVICES

/* *************************************** Suite n#6 - DOCUMENT TYPES *************************************** */
describe('Tests for document types services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  //addingDocumentType
  describe('Tests for addingDocumentType', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    //test 1
    test("Should save a new document type", async () => {
      //Data mock
      const mockNewType = { newDocumentType: "TestType" };
  
      const mockSavedObj = {
        _id: "ty1",
        type: "TestType"
      };
  
      //Support functions mocking
      jest.spyOn(DocumentType.prototype, "save").mockResolvedValueOnce(mockSavedObj);
  
      //Call of addingDocumentType
      const result = await addingDocumentType(mockNewType);

      expect(result).toEqual(mockSavedObj);
      expect(DocumentType.prototype.save).toHaveBeenCalledTimes(1);
      expect(DocumentType).toHaveBeenCalledWith({ type: mockNewType.newDocumentType });
    });

    //test 2
    test("Should throw a CustomError", async () => {
      //Data mock
      const mockInput = { newDocumentType: "TestType" };
      const err = new CustomError('Internal Server Error', 400);

      //Support functions mocking
      jest.spyOn(DocumentType.prototype, 'save').mockRejectedValue(Error());

      //Call of addingDocumentType + error check
      await expect(addingDocumentType(mockInput)).rejects.toThrow(err);

      expect(DocumentType.prototype.save).toHaveBeenCalledTimes(1);
    });
  }); //addingDocumentType
  /* ************************************************** */

  //getAllDocumentTypes
  describe('Tests for getAllDocumentTypes', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    //Data mock
    const mockDocumentTypes = [
      { _id: "ty1", type: "TestType1" },
      { _id: "ty2", type: "TestType2" }
    ];

    //test 1
    test("Should return all document types", async () => {
      //Support functions mocking
      (DocumentType.find as jest.Mock).mockImplementation(() => ({
        select: jest.fn().mockImplementation(async() =>
          mockDocumentTypes.map((type) => ({
            ...type
          }))
        )
      }));
  
      //Call of getAllDocumentTypes
      const result = await getAllDocumentTypes();
  
      expect(result).toEqual(mockDocumentTypes);
      expect(DocumentType.find).toHaveBeenCalledTimes(1);
    });

    //test 2
    test("Should throw DocumentTypeNotFoundError", async () => {
      //Data mock
      const err = new DocumentTypeNotFoundError();
      
      //Support functions mocking
      (DocumentType.find as jest.Mock).mockImplementation(() => ({
        select: jest.fn().mockImplementation(async() => [])
      }));
  
      //Call of getAllDocumentTypes + error check
      await expect(getAllDocumentTypes()).rejects.toThrow(err);
      expect(DocumentType.find).toHaveBeenCalledTimes(1);
    });
  }); //getAllDocumentTypes
  /* ************************************************** */

  //getDocumentTypeById
  describe('Tests for getDocumentTypeById', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    //Data mock
    const mockType = { _id: 'ty1', type: DocTypeEnum.Agreement };

    test('Should return an existing document type', async () => {
      //Support functions mocking
      (DocumentType.findById as jest.Mock).mockImplementation(() => ({
        select: jest.fn().mockImplementation(async() => {
          return {
            ...mockType,
              toObject: () => mockType
            }
          }
        )
      }));
  
      //Call of getDocumentTypeById
      const result = await getDocumentTypeById('ty1');
  
      expect(result).toEqual(mockType);
      expect(DocumentType.findById).toHaveBeenCalledWith('ty1');
    });

    //test 2
    test('Should throw a CustomError if the connection with the database fails', async () => {
      //Data mock
      const err = new CustomError('Internal Server Error', 400);
      
      //Support functions mocking
      (DocumentType.findById as jest.Mock).mockImplementation(() => ({
        select: jest.fn().mockImplementation(async() => null)
      }));
  
      //Call of getDocumentTypeById
      await expect(getDocumentTypeById('fakeId')).rejects.toThrow(err);
      expect(DocumentType.findById).toHaveBeenCalledWith('fakeId');
    });

    //test 3...
    // It is impossible to test when the "Error" error is thrown.
    // The reason is that the try-catch will always be triggered first by the server error
  }) //getDocumentTypeById
  /* ************************************************** */

  //fetchDocumentTypes
  describe('Tests for fetchDocumentTypes', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    //test 1
    test('Should return the asked document type', async () => {
      //Data mock
      const mockId = new mongoose.Types.ObjectId();
      const mockType = { _id: mockId.toString(), type: DocTypeEnum.Agreement };

      //Support functions mocking
      jest.spyOn(require('../services/documentType.service'), 'getDocumentTypeById')
        .mockResolvedValueOnce(mockType);
  
      //Call of fetchDocumentTypes
      const result = await fetchDocumentTypes(mockId as unknown as ObjectId);

      expect(result).toEqual(mockType);
      expect(getDocumentTypeById).toHaveBeenCalledWith(mockType._id.toString());
    });

    //test 2
    test('Should return null when no match is found', async () => {
      //Data mock
      const mockId = new mongoose.Types.ObjectId();

      //Support functions mocking
      jest.spyOn(require('../services/documentType.service'), 'getDocumentTypeById')
        .mockResolvedValueOnce(null);
      
      //Call of fetchDocumentTypes
      const result = await fetchDocumentTypes(mockId as unknown as ObjectId);
  
      expect(result).toBeNull();
      expect(getDocumentTypeById).toHaveBeenCalled();
    });

    //test 3
    test('Should return null when no input is given', async () => {
      //Call of fetchDocumentTypes
      const result = await fetchDocumentTypes(null as unknown as ObjectId);
  
      expect(result).toBeNull();
      expect(getDocumentTypeById).not.toHaveBeenCalled();
    });
  }) //fetchDocumentTypes
  /* ************************************************** */

  //fetchDocumentTypesForSearch
  describe('Tests for fetchDocumentTypesForSearch', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    //test 1
    test('Should return the id of the searched type', async () => {
      //Data mock
      const mockId = new mongoose.Types.ObjectId();
      const mockType = { _id: mockId.toString(), type: DocTypeEnum.Agreement };

      //Suport functions mocking
      (DocumentType.findOne as jest.Mock).mockImplementation(() => ({
        select: jest.fn().mockImplementation(async() => {
          return {
              ...mockType,
              toObject: () => mockType
            }
          }
        )
      }));
  
      //Call of fetchDocumentTypesForSearch
      const result = await fetchDocumentTypesForSearch(DocTypeEnum.Agreement);
  
      expect(result).toEqual(mockId.toString());
      expect(DocumentType.findOne).toHaveBeenCalled();
    });

    //test 2
    test('Should return null when no match is found', async () => {
      //Support functions mocking
      (DocumentType.findOne as jest.Mock).mockImplementation(() => ({
        select: jest.fn().mockImplementation(async() => null)
      }));
      
      //Call of fetchDocumentTypesForSearch
      const result = await fetchDocumentTypesForSearch('FakeType');
  
      expect(result).toBeNull();
      expect(DocumentType.findOne).toHaveBeenCalled();
    });

    //test 3
    test('Should return null when no input is given', async () => {
      //Call of fetchDocumentTypes
      const result = await fetchDocumentTypesForSearch(null as unknown as string);
  
      expect(result).toBeNull();
      expect(getDocumentTypeById).not.toHaveBeenCalled();
    });
  }) //fetchDocumentTypesForSearch
  /* ************************************************** */
}) //END OF DOCUMENT TYPES

/* ***************************************** Suite n#7 - STAKEHOLDERS ***************************************** */
describe('Tests for stakeholders services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  //addingStakeholder
  describe('Tests for addingStakeholder', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    //Mock of the stakeholder model
    //This is needed in order to mock the constructor of the Stakeholder object
    jest.mock("../schemas/stakeholder.schema", () => ({
      __esModule: true,
      default: jest.fn(),
    }));

    //Data mock
    const mockInput = { newStakeholderType: StakeholderEnum.LKAB };

    const mockNewStakeholder = {
      _id: 'sh1',
      type: StakeholderEnum.LKAB,
      
      save: jest.fn(),
      toObject: jest.fn().mockReturnValue(this)
    };

    //test 1
    test('Should save a new stakeholder', async () => {
      //Support functions mocking
      const MockedStakeholder = Stakeholder as jest.Mocked<typeof Stakeholder>;
      MockedStakeholder.mockImplementation(() => mockNewStakeholder as any); //Mock of the Stakeholder constructor
      jest.spyOn(mockNewStakeholder, "save").mockImplementation(async() => mockNewStakeholder);
  
      //Call of addingStakeholder
      const result = await addingStakeholder(mockInput);
  
      expect(result).toEqual(mockNewStakeholder);
      expect(Stakeholder).toHaveBeenCalledWith({ type: StakeholderEnum.LKAB });
      expect(mockNewStakeholder.save).toHaveBeenCalled();
    });

    //test 2
    test('Should throw a CustomError', async () => {
      //Data mock
      const err = new CustomError('Internal Server Error', 500);
  
      //Call of addingStakeholder + check
      await expect(addingStakeholder(null)).rejects.toThrow(err);
    });
  }) //addingStakeholder
  /* ************************************************** */

  //getAllStakeholders
  describe('Tests for getAllStakeholders', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    //Data mock
    const mockStakeholders = [
      { _id: 'sh1', type: StakeholderEnum.LKAB },
      { _id: 'sh2', type: StakeholderEnum.Citizens }
    ];

    //test 1
    test('Should return all stakeholders', async () => {
      //Support functions mocking
      (Stakeholder.find as jest.Mock).mockImplementation(() => ({
        select: jest.fn().mockImplementation(async() =>
          mockStakeholders.map((st) => ({
            ...st
          }))
        )
      }));
  
      //Call of getAllStakeholders
      const result = await getAllStakeholders();
  
      expect(result).toEqual(mockStakeholders);
      expect(Stakeholder.find).toHaveBeenCalledWith();
    });

    //test 2
    test('Should throw StakeholderNotFoundError', async () => {
      //Data mock
      const err = new StakeholderNotFoundError();
      
      //Support functions mocking
      (Stakeholder.find as jest.Mock).mockImplementation(() => ({
        select: jest.fn().mockImplementation(async() => [])
      }));
  
      //Call of getAllStakeholders + checks
      await expect(getAllStakeholders()).rejects.toThrow(err);
      expect(Stakeholder.find).toHaveBeenCalledWith();
    }) //getAllStakeholders
  }) 
  /* ************************************************** */

  //getStakeholdersById
  describe('Tests for getStakeholdersById', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    //Data mock
    const mockStakeholder = { _id: 'sh1', type: StakeholderEnum.LKAB };

    test('Should return a saved stakeholder', async () => {
      //Support functions mocking
      (Stakeholder.findById as jest.Mock).mockImplementation(() => ({
        select: jest.fn().mockImplementation(async() => {
          return {
              ...mockStakeholder,
              toObject: () => mockStakeholder
            }
          }
        )
      }));
  
      //Call of getStakeholdersById
      const result = await getStakeholdersById('sh1');
  
      expect(result).toEqual(mockStakeholder);
      expect(Stakeholder.findById).toHaveBeenCalledWith('sh1');
    });

    //test 2
    test('Should throw a CustomError if the connection with the database fails', async () => {
      //Data mock
      const err = new CustomError('Internal Server Error', 400);
      
      //Support functions mocking
      (Stakeholder.findById as jest.Mock).mockImplementation(() => ({
        select: jest.fn().mockImplementation(async() => null)
      }));
  
      //Call of getStakeholdersById
      await expect(getStakeholdersById('fakeId')).rejects.toThrow(err);
      expect(Stakeholder.findById).toHaveBeenCalledWith('fakeId');
    });
  }) //getStakeholdersById
  /* ************************************************** */

  //fetchStakeholders
  describe('Tests for fetchStakeholders', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    //test 1
    test('Should return the asked stakeholder', async () => {
      //Data mock
      const mockId = new mongoose.Types.ObjectId();
      const mockStakeholder = { _id: mockId, type: StakeholderEnum.LKAB };

      //Support functions mocking
      jest.spyOn(require('../services/stakeholder.service'), 'getStakeholdersById')
        .mockResolvedValueOnce(mockStakeholder);
  
      //Call of fetchStakeholders
      const result = await fetchStakeholders([mockId] as unknown as ObjectId[]);

      expect(result).toEqual([mockStakeholder]);
      expect(getStakeholdersById).toHaveBeenCalledWith(mockId.toString());
    });

    //test 2
    test('Should return null when no match is found', async () => {
      //Data mock
      const mockId = new mongoose.Types.ObjectId();

      //Support functions mocking
      jest.spyOn(require('../services/stakeholder.service'), 'getStakeholdersById')
        .mockResolvedValueOnce(null);
      
      //Call of fetchStakeholders
      const result = await fetchStakeholders([mockId] as unknown as ObjectId[]);
  
      expect(result).toEqual([]);
      expect(getStakeholdersById).toHaveBeenCalled();
    });

    //test 3
    test('Should return null when no input is given', async () => {
      //Call of fetchStakeholders
      const result = await fetchStakeholders([] as unknown as ObjectId[]);
  
      expect(result).toEqual([]);
      expect(getStakeholdersById).not.toHaveBeenCalled();
    });
  }) //fetchStakeholders
  /* ************************************************** */

  //fetchStakeholdersForSearch
  describe('Tests for fetchStakeholdersForSearch', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    //test 1
    test('Should return the id of the searched stakeholder', async () => {
      //Data mock
      const mockId = new mongoose.Types.ObjectId();
      const mockStakeholder = [{ _id: mockId, type: StakeholderEnum.LKAB }];

      //Suport functions mocking
      (Stakeholder.find as jest.Mock).mockImplementation(() => ({
        select: jest.fn().mockImplementation(async() =>
            mockStakeholder.map((st) => ({
              ...st
            }))
        )
      }));
  
      //Call of fetchStakeholdersForSearch
      const result = await fetchStakeholdersForSearch([StakeholderEnum.LKAB]);
  
      expect(result).toEqual([mockId]);
      expect(Stakeholder.find).toHaveBeenCalled();
    });

    //test 2
    test('Should return null when no match is found', async () => {
      //Support functions mocking
      (Stakeholder.find as jest.Mock).mockImplementation(() => ({
        select: jest.fn().mockImplementation(async() => [])
      }));
      
      //Call of fetchStakeholdersForSearch
      const result = await fetchStakeholdersForSearch(['FakeType']);

      expect(result).toEqual([]);
      expect(Stakeholder.find).toHaveBeenCalled();
    })
  }) //fetchStakeholdersForSearch
  /* ************************************************** */
}) //END OF STAKEHOLDERS