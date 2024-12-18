import { Request, Response, NextFunction } from 'express';
import { jest, describe, expect, beforeEach } from '@jest/globals';
import httpMocks from 'node-mocks-http';

import {
  getAllUsers,
  createNewUser,
  loginUser,
} from '../services/user.service';
import {
  addingDocument,
  getAllDocuments,
  getDocumentById,
  updatingDocument,
  getDocumentByType,
  getDocumentTypes,
  searchDocuments,
} from '../services/document.service';
import {
  addCoordinateService,
  getAllCoordinates,
  getCoordinateById,
  deleteCoordinateById,
} from '../services/coordinate.service';
import {
  uploadMediaService,
  updateMediaMetadata,
  getMediaMetadataById
} from '@services/media.service';
import { 
  getGraphDatas 
} from "../services/graph.service";
import {
  addingDocumentType,
  getAllDocumentTypes
} from '../services/documentType.service';
import {
  addingStakeholder,
  getAllStakeholders
} from "../services/stakeholder.service"

import {
  getUsers,
  createUser,
  login,
  getMe,
  logout,
} from '../controllers/user.controllers';
import {
  addDocumentController,
  getAllDocumentsController,
  getDocumentByIdController,
  updateDocumentController,
  getDocumentsByTypeController,
  getDocumentTypesController,
  searchDocumentsController
} from '../controllers/document.controllers';
import {
  addCoordinate,
  getAllCoordinatesController,
  getCoordinateByIdController,
  deleteCoordinateByIdController,
} from '../controllers/coordinate.controllers';
import {
  uploadMediaController,
  UpdateMediaController,
  getMediaMetadataByIdController
} from '../controllers/media.controllers';
import { 
  getGraphConstruction 
} from "../controllers/graph.controllers";
import {
  addDocumentTypeController,
  getAllDocumentTypesController
} from '../controllers/documentType.controllers';
import {
  addStakeholderController,
  getAllStakeholdersController
} from '../controllers/stakeholder.controllers';

import { IUserResponse } from '../interfaces/user.return.interface';
import { CustomRequest } from '../interfaces/customRequest.interface';
import { UserRoleEnum } from '../utils/enums/user-role.enum';
import { DocTypeEnum } from '../utils/enums/doc-type.enum';
import { CustomError } from '../utils/customError';
import {
  BadConnectionError,
  DocNotFoundError,
  PositionError,
  MediaNotFoundError,
} from '@utils/errors';
import { StakeholderEnum } from '@utils/enums/stakeholder.enum';

jest.mock('../services/user.service'); //For suite n#1
jest.mock('../services/document.service'); //For suite n#2
jest.mock('../services/coordinate.service'); //For suite n#3
jest.mock('../services/media.service'); //For suite n#4
jest.mock('../services/graph.service'); //For suite n#5
jest.mock('../services/documentType.service'); //For suite n#6
jest.mock('../services/stakeholder.service'); //For suite n#7

/* ******************************************* Suite n#1 - USERS ******************************************* */
describe('Tests for user controllers', () => {
  //Mock of the objects that will be use to test controllers
  let req: Partial<CustomRequest>;
  let res: Partial<Response>;
  let next: NextFunction;

  //Code to clear each mocked data used
  beforeEach(() => {
    req = {};
    res = { json: jest.fn() } as Partial<Response>;
    next = jest.fn();

    jest.clearAllMocks();
  });
  /* ************************************************** */

  //getUsers
  describe('Tests for getUsers', () => {
    //test 1
    test('Should respond with a list of users', async () => {
      //Data mocking
      const mockUsers: IUserResponse[] = [
        {
          id: '1',
          name: 'Daniele',
          email: 'dani@ex.com',
          surname: 'De Rossi',
          phone: '123456789',
          role: UserRoleEnum.Visitor,
        },
        {
          id: '1',
          name: 'Pippo',
          email: 'pippo@ex.com',
          surname: 'Baudo',
          phone: '987654321',
          role: UserRoleEnum.Uplanner,
        },
      ];

      //Support functions mocking
      (getAllUsers as jest.Mock).mockImplementation(async () => mockUsers);

      //Call of getUsers
      await getUsers(req as Request, res as Response, next);

      expect(res.json).toHaveBeenCalledWith(mockUsers);
      expect(getAllUsers).toHaveBeenCalledTimes(1);
    });

    //test 2
    test("Should throw an error if datas aren't well retrieved from the database", async () => {
      const err = new Error('An error occurred with the DB');

      //Support functions mocking
      (getAllUsers as jest.Mock).mockImplementationOnce(() => {
        //getAllUsers wasn't thinked to throw any error so to test this feature of getUsers is needed to simulate one
        throw err;
      });

      //Call of getUsers
      await getUsers(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(err);
      expect(next).toHaveBeenCalledTimes(1);
      expect(res.json).not.toHaveBeenCalled();
    });
  }); //getUsers
  /* ************************************************** */

  //createUser
  describe('Tests for createUser', () => {
    //test 1
    test('Should successfully create a new user', async () => {
      //Data mocking
      req = {
        body: {
          name: 'Lautaro',
          email: 'lautaro@ex.com',
          password: 'password123',
          surname: 'Martinez',
          phone: '123456789',
          role: UserRoleEnum.Visitor,
        },
      };

      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response>;

      const mockResult = 'User created successfully';

      //Support functions mocking
      (createNewUser as jest.Mock).mockImplementation(async () => mockResult);

      //Call of createUser
      await createUser(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockResult);
      expect(createNewUser).toHaveBeenCalledWith(req.body);
    });

    //test 2
    test("The user isn't signed up due to a database error", async () => {
      //Data mocking
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response>;

      const err = new CustomError('Password is required', 400);

      //Support functions mocking
      jest
        .spyOn(require('../services/user.service'), 'createNewUser')
        .mockImplementation(async () => {
          throw err;
        });

      //Call of createUser
      await createUser(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(err);
      expect(next).toHaveBeenCalledTimes(1);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  }); //createUser
  /* ************************************************** */

  //login
  describe('Tests for login', () => {
    //test 1
    test('Should successfully log a registered user', async () => {
      //Data mocking
      req = {
        body: {
          email: 'sergio@example.com',
          password: 'password123',
        },
      };

      res = {
        cookie: jest.fn(),
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      } as Partial<Response>;

      const cookie_settings = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 3600000,
        path: '/',
      };

      const fakeToken = 'fake_token_value';

      //Support functions mocking
      (loginUser as jest.Mock).mockImplementation(async () => ({
        token: fakeToken,
      }));

      //Call of login
      await login(req as CustomRequest, res as Response, next);

      expect(loginUser).toHaveBeenCalledWith(req.body.email, req.body.password);
      expect(res.cookie).toHaveBeenCalledWith(
        'auth-token',
        fakeToken,
        cookie_settings,
      );
      expect(res.json).toHaveBeenCalledWith({ token: fakeToken });
    });

    //test 2
    test('Should return an error', async () => {
      //Data mocking
      req = {
        body: {
          email: 'user@example.com',
          password: 'wronPassword12',
        },
      };

      res = {
        cookie: jest.fn(),
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      } as Partial<Response>;

      const fakeToken = 'fake_token_value';
      const err = new CustomError('Login has failed', 400);

      //Support functions mocking
      jest
        .spyOn(require('../services/user.service'), 'loginUser')
        .mockImplementation(async () => {
          throw err;
        });

      //Call of login
      await login(req as CustomRequest, res as Response, next);

      expect(next).toHaveBeenCalledWith(err);
      expect(res.cookie).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  }); //login
  /* ************************************************** */

  //getMe
  describe('Tests for getMe', () => {
    //test 1
    test('Should successfully retrieve the infos of a logged user', async () => {
      //Data mocking
      req = {
        user: {
          id: '1',
          name: 'Carlo',
          email: 'carlo@example.com',
          surname: 'Cracco',
          phone: '123456789',
          role: UserRoleEnum.Udeveloper,
        },
      } as Partial<CustomRequest>;

      //Call of getMe
      await getMe(req as CustomRequest, res as Response, next);

      expect(res.json).toHaveBeenCalledWith({
        id: '1',
        name: 'Carlo',
        email: 'carlo@example.com',
        surname: 'Cracco',
        phone: '123456789',
        role: UserRoleEnum.Udeveloper,
      });
      expect(next).not.toHaveBeenCalled();
    });

    //test 2
    test('Should return an error', async () => {
      //Data mocking
      req = {} as Partial<CustomRequest>;
      const err = new CustomError('User not authenticated', 401);

      //Call of getMe
      await getMe(req as CustomRequest, res as Response, next);

      expect(next).toHaveBeenCalledWith(err);
      expect(res.json).not.toHaveBeenCalled();
    });
  }); //getMe
  /* ************************************************** */

  //logout
  describe('Tests for logout', () => {
    //test 1
    test('Should logout a logged user', async () => {
      //Data mock
      res = {
        clearCookie: jest.fn(),
        json: jest.fn(),
        status: jest.fn(() => res),
      } as unknown as Response;

      //In the response "clearCookie" and "jest" were mocked

      //Call of logout
      await logout(req as CustomRequest, res as Response, next);

      //Here the auth-token is cleared, this process emulate the logout action
      expect(res.clearCookie).toHaveBeenCalledWith('auth-token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
      });
      expect(res.json).toHaveBeenCalledWith({
        message: 'User logged out successfully',
      });
    });

    //test 2
    test('Should throw an error', async () => {
      //Data mock
      const err = new Error();

      //Here clearCookie is mocked in order to throw an error
      //If this function fails it means that something went wrong during the logout (ex: doesn't have an active access cookie)
      res.clearCookie = jest.fn(() => {
        throw err;
      });

      //Call of logout
      await logout(req as CustomRequest, res as Response, next);

      expect(next).toHaveBeenCalledWith(err);
    });
  }); //logout
}); //END OF USER CONTROLLERS

/* ******************************************* Suite n#2 - DOCUMENTS ******************************************* */
describe('Tests for document controllers', () => {
  //Connection mocking
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  //addDocumentController
  describe('Tests for addDocumentController', () => {
    beforeEach(() => {
      req = {
        body: {
          title: 'Test document',
          stakeholders: 'Company A',
          scale: 'Test value',
          type: DocTypeEnum.Agreement,
          date: '01-01-2000',
          connections: undefined,
          language: undefined,
          media: undefined,
          coordinates: undefined,
          summary: 'Test summary',
        },
      };

      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response>;

      next = jest.fn();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    //test 1
    test('Should return a new document', async () => {
      //Data mocking
      const mockNewDocument = { id: 'mockedId', ...req.body }; //Mock of retrieved result

      //Mock of support functions
      (addingDocument as jest.Mock).mockImplementation(
        async () => mockNewDocument,
      );

      //Call of addDocumentController
      await addDocumentController(req as Request, res as Response, next);

      expect(addingDocument).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockNewDocument);
    });

    //test 2
    test('Should throw and error if the connection fails', async () => {
      //Data mocking
      const err = new CustomError('Database Error', 500);

      //Support functions mocking
      jest
        .spyOn(require('../services/document.service'), 'addingDocument')
        .mockImplementation(async () => {
          throw err;
        });

      //Call of addDocumentController
      await addDocumentController(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(err);
    });
  }); //addDocumentController
  /* ************************************************** */

  //getAllDocumentsController
  describe('Tests for getAllDocumentsController', () => {
    let req: Partial<Request>;
    let res: Response;
    let next: NextFunction;

    //Database data mocking
    const mockDocuments = [
      {
        id: '1',
        title: 'Test 1',
        stakeholders: 'Company A',
        scale: 'Test value 1',
        type: DocTypeEnum.Agreement,
        date: '01-01-2000',
        summary: 'Summary 1',
        connections: [],
        language: 'EN',
        media: [],
        coordinates: null,
      },
      {
        id: '2',
        title: 'Test 2',
        stakeholders: 'Company B',
        scale: 'Test value 2',
        type: DocTypeEnum.Conflict,
        date: '02-01-2000',
        summary: 'Summary 2',
        connections: [],
        language: 'IT',
        media: [],
        coordinates: null,
      },
    ];

    beforeEach(() => {
      //No need to fill a request
      req = {};

      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      next = jest.fn();
    });

    //test 1
    test('Should return all documents', async () => {
      //Support functions mocking
      (getAllDocuments as jest.Mock).mockImplementation(
        async () => mockDocuments,
      );

      //Call of getAllDocumentsController
      await getAllDocumentsController(req as Request, res as Response, next);

      expect(getAllDocuments).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockDocuments);
    });

    //test 2
    test('Should return an error for not retrieving any document', async () => {
      //Data mocking
      const err = new CustomError('Database Error', 404);

      //Support functions mocking
      jest
        .spyOn(require('../services/document.service'), 'getAllDocuments')
        .mockImplementation(async () => {
          throw err;
        });

      //Call of getAllDocumentsController
      await getAllDocumentsController(req as Request, res, next);

      expect(next).toHaveBeenCalledWith(err);
    });
  }); //getAllDocumentsController
  /* ************************************************** */

  //getDocumentByIdController
  describe('Tests for getDocumentByIdController', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
      req = { params: { id: '1' } };

      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      next = jest.fn();
    });

    const mockId = '1';

    const mockDocument = {
      id: mockId,
      title: 'Test Document',
      stakeholders: 'Company A',
      scale: 'Test value',
      type: DocTypeEnum.Agreement,
      date: '2023-01-01',
      summary: 'Test summary',
      connections: [],
      language: 'English',
      media: [],
      coordinates: null,
    };

    //test 1
    test('Should return the found document', async () => {
      //Support functions mocking
      (getDocumentById as jest.Mock).mockImplementation(
        async () => mockDocument,
      );

      //Call of getDocumentByIdController
      await getDocumentByIdController(req as Request, res as Response, next);

      expect(getDocumentById).toHaveBeenCalledWith(mockId);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockDocument);
    });

    //test 2
    test('Should return an error if the document is not found', async () => {
      //Data mock
      const err = new DocNotFoundError();

      req = {
        params: { id: 'wrongId' },
      };

      //Support functions mocking 

      //getDocumentById returns null if no document is found (DocNotFoundError is thrown controller side)
      (getDocumentById as jest.Mock).mockImplementation(async () => null);

      //Call of getDocumentByIdController
      await getDocumentByIdController(req as Request, res as Response, next);

      expect(getDocumentById).toHaveBeenCalledWith('wrongId');
      expect(next).toHaveBeenCalledWith(err);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    //test 3
    test('Should return an error if the connection to the DB fails', async () => {
      //Data mock
      const err = new BadConnectionError();

      //Support functions mocking
      jest
        .spyOn(require('../services/document.service'), 'getDocumentById')
        .mockImplementation(async () => {
          throw err;
        });

      //Call of getDocumentByIdController
      await getDocumentByIdController(req as Request, res as Response, next);

      expect(getDocumentById).toHaveBeenCalledWith('1');
      expect(next).toHaveBeenCalledWith(err);
    });
  }); //getDocumentByIdController
  /* ************************************************** */

  //updateDocumentController
  describe('Tests for updateDocumentController', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
      req = {
        params: { id: '1' },
        body: {
          title: 'Test doc',
          stakeholders: 'Company B',
          scale: 'Test value 2',
          type: DocTypeEnum.Conflict,
          date: '02-01-2000',
          summary: 'Tets summary updated',
        },
      };

      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      next = jest.fn();
    });

    //test 1
    test('Should complete the update and return 200', async () => {
      //Data mocking
      const mockId = '1';

      const mockUpdatedDocument = {
        id: mockId,
        title: 'Updated Document',
        stakeholders: 'Company A',
        scale: 'Test value',
        type: DocTypeEnum.Agreement,
        date: '2023-01-01',
        summary: 'Updated summary',
        connections: [],
        language: 'English',
        media: [],
        coordinates: null,
      };

      //Support functions mocking
      (updatingDocument as jest.Mock).mockImplementation(
        async () => mockUpdatedDocument,
      );

      //Call of updateDocumentController
      await updateDocumentController(req as Request, res as Response, next);

      expect(updatingDocument).toHaveBeenCalledWith(mockId, req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUpdatedDocument);
    });

    //test 2
    test('Should return an error as the document is not found', async () => {
      //Support functions mocking
      //NOTE:
      //The service "updatingDocument" was not designed to throw a "DocNotFoundError"
      //So the document is "not found" if an empty object (aka a null object) is returned by the method
      (updatingDocument as jest.Mock).mockImplementation(async () => null);

      //Call of updateDocumentController
      await updateDocumentController(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(new DocNotFoundError());
    });
    //test 3
    it('Should return an error as the connection with the database fails', async () => {
      //Data mocking
      const err = new BadConnectionError();

      //Support functions mocking
      jest
        .spyOn(require('../services/document.service'), 'updatingDocument')
        .mockImplementation(async () => {
          throw err;
        });

      //Call of updatingDocument
      await updateDocumentController(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(err);
    });
  }); //updateDocumentController
  /* ************************************************** */

  //getDocumentsByTypeController
  describe('Tests for getDocumentsByTypeController', () => {
    beforeEach(() => {
      req = {
        params: { type: DocTypeEnum.Agreement },
      };

      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      next = jest.fn();
    });

    const MockType = DocTypeEnum.Agreement;

    const mockDocuments = [
      {
        id: '1',
        title: 'Test 1',
        stakeholders: 'Company A',
        scale: 'Test value 1',
        type: MockType,
        date: '01-01-2000',
        summary: 'Summary 1',
        connections: [],
        language: 'EN',
        media: [],
        coordinates: null,
      },
      {
        id: '2',
        title: 'Test 2',
        stakeholders: 'Company B',
        scale: 'Test value 2',
        type: DocTypeEnum.Conflict,
        date: '02-01-2000',
        summary: 'Summary 2',
        connections: [],
        language: 'IT',
        media: [],
        coordinates: null,
      },
    ];

    afterEach(() => {
      jest.clearAllMocks();
    });

    //test 1
    test('Should return the requested documents successfully', async () => {
      //Support functions mocking
      (getDocumentByType as jest.Mock).mockImplementation(
        async () => mockDocuments[0],
      );

      //Call of getDocumentsByTypeController
      await getDocumentsByTypeController(req as Request, res as Response, next);

      expect(getDocumentByType).toHaveBeenCalledWith(MockType);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ documents: mockDocuments[0] });
    });

    //test 2
    test('Should throw a DocNotFoundError', async () => {
      //Data mocking
      const err = new DocNotFoundError();

      //Support functions mocking
      jest
        .spyOn(require('../services/document.service'), 'getDocumentByType')
        .mockImplementation(async () => {
          throw err;
        });

      //Call of getDocumentsByTypeController
      await getDocumentsByTypeController(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(err);
    });

    //test 3
    test('Should throw an error if the connection fails', async () => {
      //Data mocking
      const err = new CustomError('Database Error', 500);

      //Support functions mocking
      jest
        .spyOn(require('../services/document.service'), 'getDocumentByType')
        .mockImplementation(async () => {
          throw err;
        });

      //Call of getDocumentsByTypeController
      await getDocumentsByTypeController(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(err);
    });
  }); //getDocumentsByTypeController
  /* ************************************************** */

  //"deleteDocumentController" is a test method, it isn't implemented in the application
  //due to this reason it is not tested
  /* ************************************************** */

  //getDocumentTypesController
  describe('Tests for getDocumentTypesController', () => {
    //test 1
    test('Should retrive all document types', async() => {
      //Data mock
      const mockDocTypes = [
        { label: DocTypeEnum.Agreement, value: "ty1" },
        { label: DocTypeEnum.Conflict, value: "ty2" },
        { label: 'CustomType1', value: "ty3" }
      ];

      //Support functions mocking
      (getDocumentTypes as jest.Mock).mockReturnValue(mockDocTypes);

      //Call of getDocumentTypesController
      await getDocumentTypesController(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockDocTypes);
      expect(next).not.toHaveBeenCalled();
    });

    //test 2
    test('Should throw an error', async() => {
      //Data mock
      const err = new Error();

      //Support functions mocking
      (getDocumentTypes as jest.Mock).mockImplementation(() => {
        throw err;
      });

      //Call of getDocumentTypesController
      await getDocumentTypesController(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(err);
    });
  }); //getDocumentTypesController
  /* ************************************************** */

  //searchDocumentsController
  describe('Tests for searchDocumentsController', () => {
    //Data mock
    const mockDocuments = [
      { id: '1', title: 'Title1', coordinates: null },
      { id: '2', title: 'Title2', coordinates: null },
    ];

    //test 1
    test('Should response with the searched documents', async () => {
      //Input mock
      const mockKeywords = ['keyword1', 'keyword2'];

      //Request mock
      //With "httpMocks.createRequest" it was possible to create a mock for the right expected request
      const req = httpMocks.createRequest({
        method: 'GET',
        url: '/api/documents',
        query: {
          keywords: JSON.stringify(mockKeywords),
        },
      });

      //Support functions mocking
      (searchDocuments as jest.Mock).mockImplementation(
        async () => mockDocuments,
      );

      //Call of searchDocumentsController
      await searchDocumentsController(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockDocuments);
    });

    //test 2
    test('Should throw an error', async () => {
      //Request mock
      //The query input format is on purpose wrong (instead of a JSON, was given a string)
      const req = httpMocks.createRequest({
        method: 'GET',
        url: '/api/documents',
        query: {
          keywords: 'wrongInput',
        },
      });

      //Call of searchDocumentsController
      await searchDocumentsController(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  }); //searchDocumentsController
}); //END OF DOCUMENT CONTROLLERS

/* ******************************************* Suite n#3 - COORDINATES ******************************************* */
describe('Tests for coordinate controllers', () => {
  //Connetion mocking
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      body: {
        type: 'Point',
        coordinates: [45.123, 7.123],
        name: 'Test coordinate',
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    next = jest.fn();
  });

  //Clearing operations
  afterEach(() => {
    jest.clearAllMocks();
  });

  //addCoordinate
  describe('Tests for addCoordinate', () => {
    //test 1
    test('Should add the new coordinate', async () => {
      //Data mocking
      const mockCoordinate = {
        type: 'Point',
        coordinates: [45.123, 7.123],
        name: 'Test coordinate',
      };

      //Mocking of support functions
      (addCoordinateService as jest.Mock).mockImplementation(
        async () => mockCoordinate,
      );

      //Call of addCoordinate
      await addCoordinate(req as Request, res as Response, next);

      expect(addCoordinateService).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Coordinate added successfully',
        coordinate: mockCoordinate,
      });
    });

    //test 2
    test('Should throw an error if the connection fails', async () => {
      //Data mocking
      const err = new CustomError('Internal Server Error', 500);

      //Support functions mocking
      jest
        .spyOn(
          require('../services/coordinate.service'),
          'addCoordinateService',
        )
        .mockImplementation(async () => {
          throw err;
        });

      //Call of addCoordinate
      await addCoordinate(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(err);
    });
  }); //addCoordinate
  /* ************************************************** */

  //getAllCoordinatesController
  describe('Tests for getAllCoordinatesController', () => {
    //test 1
    test('Should return all the coordinates', async () => {
      //Data mocking
      const mockCoordinates = [
        { type: 'Point', coordinates: [45.123, 7.123], name: 'Coordinate 1' },
        { type: 'Point', coordinates: [46.123, 8.123], name: 'Coordinate 2' },
      ];

      //Support functions mocking
      (getAllCoordinates as jest.Mock).mockImplementation(
        async () => mockCoordinates,
      );

      //Call of getAllCoordinatesController
      await getAllCoordinatesController(req as Request, res as Response, next);

      expect(getAllCoordinates).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockCoordinates);
    });

    //test 2
    test('Should throw an error if the connection fails', async () => {
      //Data mocking
      const err = new CustomError('Database Error', 500);

      //Support functions mocking
      jest
        .spyOn(require('../services/coordinate.service'), 'getAllCoordinates')
        .mockImplementation(async () => {
          throw err;
        });

      //Call of getAllCoordinatesController
      await getAllCoordinatesController(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(err);
    });
  }); //getAllCoordinatesController
  /* ************************************************** */

  //getCoordinateByIdController
  describe('Tests for getCoordinateByIdController', () => {
    //test 1
    test('Should return the requested coordinate', async () => {
      //Data mocking
      const mockCoordinateId = '1';

      req = {
        params: { id: '1' },
      };

      const mockCoordinate = {
        type: 'Point',
        coordinates: [45.123, 7.123],
        name: 'Coordinate Test',
      };

      //Support functions mock
      (getCoordinateById as jest.Mock).mockImplementation(
        async () => mockCoordinate,
      );

      //Call of getCoordinateByIdController
      await getCoordinateByIdController(req as Request, res as Response, next);

      expect(getCoordinateById).toHaveBeenCalledWith(mockCoordinateId);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockCoordinate);
    });

    //test 2
    test('Should throw an error if the coordinate is not found', async () => {
      //Data mocking
      req = {
        params: { id: '100' },
      };

      const err = new PositionError();

      //Support functions mocking
      (getCoordinateById as jest.Mock).mockImplementation(async () => null);

      //Call of getCoordinateByIdController
      await getCoordinateByIdController(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(err);
    });

    //test 3
    test('Should throw an error if the connection fails', async () => {
      //Data mocking
      const err = new CustomError('Internal Server Error', 500);

      //Support functions mocking
      jest
        .spyOn(require('../services/coordinate.service'), 'getCoordinateById')
        .mockImplementation(async () => {
          throw err;
        });

      //Call of getCoordinateByIdController
      await getCoordinateByIdController(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(err);
    });
  }); //getCoordinateByIdController
  /* ************************************************** */

  //"deleteCoordinateController" isn't tested because the application doesn't use it
  /* ************************************************** */

  //deleteCoordinateByIdController
  describe('Tests for deleteCoordinateByIdController', () => {
    //test 1
    test('Should delete the choosen coordinate', async () => {
      //Data mock
      req = {
        params: { id: '1' },
      };

      //Support functions mocking
      (deleteCoordinateById as jest.Mock).mockImplementation(async () => true);

      //Call of deleteCoordinateByIdController
      await deleteCoordinateByIdController(
        req as Request,
        res as Response,
        next,
      );

      expect(deleteCoordinateById).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Coordinate deleted successfully',
      });
    });

    //test 2
    test('Should throw PositionError', async () => {
      //Data mock
      req = {
        params: { id: 'wrongId' },
      };

      //Data mock
      const err = new PositionError();

      //Support functions mocking
      jest
        .spyOn(
          require('../services/coordinate.service'),
          'deleteCoordinateById',
        )
        .mockImplementation(async () => {
          throw err;
        });

      //Call of deleteCoordinateByIdController
      await deleteCoordinateByIdController(
        req as Request,
        res as Response,
        next,
      );

      expect(deleteCoordinateById).toHaveBeenCalledWith('wrongId');
      expect(next).toHaveBeenCalledWith(err);
    });
  }); //deleteCoordinateByIdController
}); //END OF COORDINATE CONTROLLERS

/* ******************************************* Suite n#4 - MEDIA ******************************************* */
describe('Tests for media controllers', () => {
  //Connetion objects mock
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  //uploadMediaController
  describe('Tests for uploadMediaController', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    //Connection mocking
    beforeEach(() => {
      req = {
        body: {
          filename: 'example.jpg',
          size: 1024,
          mimetype: 'image/jpeg',
        },
        user: {
          id: '1',
        },
      } as unknown as Request;

      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      next = jest.fn();
    });

    //test 1
    test('Should upload the given metadata', async () => {
      //Data mock
      const mockMediaMetadata = {
        url: 'https://cdn.example.com/presigned-url',
      };

      const mediaData = {
        filename: 'example.jpg',
        size: 1024,
        mimetype: 'image/jpeg',
        userId: '1',
      };

      //Support functions mocking
      (uploadMediaService as jest.Mock).mockImplementation(
        async () => mockMediaMetadata,
      );

      //Call of uploadMediaController
      await uploadMediaController(req as Request, res as Response, next);

      expect(uploadMediaService).toHaveBeenCalledWith(mediaData);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'File validated and metadata saved successfully',
        data: { url: 'https://cdn.example.com/presigned-url' },
      });
    });

    //test 2
    test("Should throw an error if the user isn't authenticated", async () => {
      //Data mock
      req = {
        body: req.body,
        user: undefined,
      } as unknown as Request;

      //Call of uploadMediaController
      await uploadMediaController(req as CustomRequest, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User not authenticated',
      });
      expect(uploadMediaService).not.toHaveBeenCalled();
    });

    //test 3
    test('Should throw an error if the connection fails', async () => {
      //Data mock
      const err = new Error('Service error');

      //Support functions mocking
      jest
        .spyOn(require('@services/media.service'), 'uploadMediaService')
        .mockRejectedValue(err);

      //Call of uploadMediaController
      await uploadMediaController(req as CustomRequest, res as Response, next);

      expect(next).toHaveBeenCalledWith(err);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  }); //uploadMediaController
  /* ************************************************** */

  //UpdateMediaController
  describe('Tests for UpdateMediaController', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    //Connection mocking
    beforeEach(() => {
      req = {
        body: {
          mediaId: '1',
          metadata: {
            size: 1024,
            pages: 10,
          },
        },
      };

      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      next = jest.fn();
    });

    //test 1
    test('Should update the selected media metadata', async () => {
      //Support functions mocking
      (updateMediaMetadata as jest.Mock).mockImplementation(
        async () => undefined,
      );

      //Call of UpdateMediaController
      await UpdateMediaController(req as Request, res as Response, next);

      expect(updateMediaMetadata).toHaveBeenCalledWith('1', {
        size: 1024,
        pages: 10,
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Media metadata updated successfully',
      });
      expect(next).not.toHaveBeenCalled();
    });

    //test 2
    test('Should throw MediaNotFoundError', async () => {
      //Data mock
      const err = new MediaNotFoundError();

      //Support functions mocking
      jest
        .spyOn(require('@services/media.service'), 'updateMediaMetadata')
        .mockRejectedValue(err);

      //Call of UpdateMediaController
      await UpdateMediaController(req as Request, res as Response, next);

      expect(updateMediaMetadata).toHaveBeenCalledWith('1', {
        size: 1024,
        pages: 10,
      });
      expect(res.status).toHaveBeenCalledWith(err.status);
      expect(res.json).toHaveBeenCalledWith({ message: err.message });
      expect(next).not.toHaveBeenCalled();
    });

    //test 3
    test('Should throw an error if the connection fails', async () => {
      //Data mock
      const err = new Error();

      //Support functions mocking
      jest
        .spyOn(require('@services/media.service'), 'updateMediaMetadata')
        .mockRejectedValue(err);

      //Call of UpdateMediaController
      await UpdateMediaController(req as Request, res as Response, next);

      expect(updateMediaMetadata).toHaveBeenCalledWith('1', {
        size: 1024,
        pages: 10,
      });
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(err);
    });
  }); //UpdateMediaController
  /* ************************************************** */

  //getMediaMetadataByIdController
  describe("getMediaMetadataByIdController", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    //Connection mocking
    beforeEach(() => {
      req = {
        params: {
          mediaId: 'media1'
        }
      };

      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      next = jest.fn();
    });

    //Data mock
    const mockMediaMetadata = {
      id: "media1",
      filename: "test.pdf",
      url: "example/url",
      type: "document",
      mimetype: "application/pdf",
      pages: 10
    };
  
    //test 1
    test("Should return media metadata", async () => {
      //Support functions mock
      (getMediaMetadataById as jest.Mock).mockImplementation(async() => mockMediaMetadata);

      //Call of getMediaMetadataByIdController
      await getMediaMetadataByIdController(req as Request, res as Response, next);
  
      expect(getMediaMetadataById).toHaveBeenCalledWith("media1");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Media metadata retrieved successfully",
        data: mockMediaMetadata,
      });
    });
  
    //test 2
    //MediaNotFoundError also triggers the next error branch!
    test("Should throw MediaNotFoundError", async () => {
      //Data mock
      const err = new MediaNotFoundError();
      
      //Support functions metod
      //getMediaMetadataById was designed not to throw an error but to return null if nothing is retrieved
      (getMediaMetadataById as jest.Mock).mockImplementation(async() => null);

      //Call of getMediaMetadataByIdController
      await getMediaMetadataByIdController(req as Request, res as Response, next);
  
      expect(getMediaMetadataById).toHaveBeenCalledWith("media1");
      expect(next).toHaveBeenCalledWith(err);
    });
  }); //getMediaMetadataByIdController
}); //END OF MEDIA CONTROLLERS

/* ******************************************* Suite n#5 - GRAPH ******************************************* */
describe('Tests for graph controllers', () => {
  //Connetion objects mock
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;
  
  //getGraphConstruction
  describe('Tests for getGraphConstruction', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    //Connection mocking
    beforeEach(() => {
      req = {} as unknown as Request;

      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      next = jest.fn();
    });

    //test 1
    test("Should return the data needed to build the graph", async () => {
      //Return value mock
      const mockData = {
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
      };

      //Support functions mocking
      (getGraphDatas as jest.Mock).mockImplementation(() => mockData);
  
      //Call of getGraphConstruction
      await getGraphConstruction(req as Request, res as Response, next);
  
      expect(getGraphDatas).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockData);
    });

    //test 2
    test("Should throw an error if the connection fails", async () => {
      //Data mock
      const err = new CustomError("Internal Server Error", 500);

      //Support functions mocking
      jest.spyOn(require("../services/graph.service"), "getGraphDatas").mockRejectedValue(err);
  
      //Call of getGraphDatas
      await getGraphConstruction(req as Request, res as Response, next);

      expect(getGraphDatas).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(err);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  }); //getGraphConstruction
  /* ************************************************** */
}) //END OF GRAPH CONTROLLERS

/* **************************************** Suite n#6 - DOCUMENT TYPES **************************************** */
describe('Tests for document type controllers', () => {
  //Connection mocking
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  //addDocumentTypeController
  describe('Tests for addDocumentTypeController', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    //Connection mocking
    beforeEach(() => {
      req = {} as unknown as Request;

      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      next = jest.fn();
    });

    //test 1
    test('Should create a new document type', async () => {
      //Data mock
      const mockType = { id: 'ty1', type: DocTypeEnum.Agreement };

      //Support functions mocking
      jest.spyOn(require('../services/documentType.service'), 'addingDocumentType')
        .mockResolvedValueOnce(mockType)
  
      //Call of addDocumentTypeController
      await addDocumentTypeController(req as Request, res as Response, next);
  
      expect(addingDocumentType).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockType);
    });

    //test 2
    test('Should throw an error if the connection fails', async () => {
      //Data mock
      const err = new CustomError('Internal Server Error', 500);

      //Support functions mocking
      jest.spyOn(require('../services/documentType.service'), 'addingDocumentType')
        .mockRejectedValueOnce(err);
  
      //Call of addDocumentTypeController
      await addDocumentTypeController(req as Request, res as Response, next);
  
      expect(next).toHaveBeenCalledWith(err);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  }); //addDocumentTypeController
  /* ************************************************** */

  //getAllDocumentTypesController
  describe('Tests for getAllDocumentTypesController', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    //Connection mocking
    beforeEach(() => {
      req = {} as unknown as Request;

      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      next = jest.fn();
    });

    //test 1
    test('Should retrieve all available document types', async () => {
      //Data mock
      const mockTypes = [
        { id: 'ty1', type: DocTypeEnum.Agreement },
        { id: 'ty2', type: DocTypeEnum.Conflict }
      ];

      //Support functions mocking
      jest.spyOn(require('../services/documentType.service'), 'getAllDocumentTypes')
        .mockResolvedValueOnce(mockTypes);
  
      //Call of getAllDocumentTypesController
      await getAllDocumentTypesController(req as Request, res as Response, next);
  
      expect(getAllDocumentTypes).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockTypes);
    });

    //test 2
    test('Should throw an error if the connection fails', async () => {
      //Data mock
      const err = new CustomError('Internal Server Error', 500);

      //Support functions mocking
      jest.spyOn(require('../services/documentType.service'), 'getAllDocumentTypes')
        .mockRejectedValueOnce(err);
  
      //Call of getAllDocumentTypesController
      await getAllDocumentTypesController(req as Request, res as Response, next);
  
      expect(next).toHaveBeenCalledWith(err);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  }); //getAllDocumentTypesController
  /* ************************************************** */
}) //END OF DOCUMENT TYPES CONTROLLERS

/* **************************************** Suite n#6 - STAKEHOLDERS **************************************** */
describe('Tests for stakeholder controllers', () => {
  //Connection mocking
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  //addStakeholderController
  describe('Tests for addStakeholderController', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    //Connection mocking
    beforeEach(() => {
      req = {} as unknown as Request;

      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      next = jest.fn();
    });

    //test 1
    test('Should create a new stakeholder', async () => {
      //Data mock
      const mockStakeholder = { id: 'sh1', type: StakeholderEnum.LKAB };

      //Support functions mocking
      jest.spyOn(require('../services/stakeholder.service'), 'addingStakeholder')
        .mockResolvedValueOnce(mockStakeholder);
  
      //Call of addStakeholderController
      await addStakeholderController(req as Request, res as Response, next);
  
      expect(addingStakeholder).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockStakeholder);
    });

    //test 2
    test('Should throw an error if the connection fails', async () => {
      //Data mock
      const err = new CustomError('Internal Server Error', 500);

      //Support functions mocking
      jest.spyOn(require('../services/stakeholder.service'), 'addingStakeholder')
        .mockRejectedValueOnce(err);
  
      //Call of addStakeholderController
      await addStakeholderController(req as Request, res as Response, next);
  
      expect(next).toHaveBeenCalledWith(err);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  }); //addStakeholderController
  /* ************************************************** */

  //getAllStakeholdersController
  describe('Tests for getAllStakeholdersController', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    //Connection mocking
    beforeEach(() => {
      req = {} as unknown as Request;

      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      next = jest.fn();
    });

    //test 1
    test('Should retrieve all the available stakeholders', async () => {
      //Data mock
      const mockStakeholders = [
        { id: 'sh1', type: StakeholderEnum.LKAB },
        { id: 'sh2', type: StakeholderEnum.Citizens }
      ];

      //Support functions mocking
      jest.spyOn(require('../services/stakeholder.service'), 'getAllStakeholders')
        .mockResolvedValueOnce(mockStakeholders);
  
      //Call of getAllStakeholdersController
      await getAllStakeholdersController(req as Request, res as Response, next);
  
      expect(getAllStakeholders).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockStakeholders);
    });

    //test 2
    test('Should throw an error if the connection fails', async () => {
      //Data mock
      const err = new CustomError('Internal Server Error', 500);

      //Support functions mocking
      jest.spyOn(require('../services/stakeholder.service'), 'getAllStakeholders')
        .mockRejectedValueOnce(err);
  
      //Call of getAllStakeholdersController
      await getAllStakeholdersController(req as Request, res as Response, next);
  
      expect(next).toHaveBeenCalledWith(err);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  }); //getAllStakeholdersController
  /* ************************************************** */
}) //END OF STAKEHOLDERS CONTROLLERS