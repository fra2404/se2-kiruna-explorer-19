import { Request, Response, NextFunction } from 'express';
import { jest, describe, expect, beforeEach } from '@jest/globals';

import { IUserResponse } from '../interfaces/user.return.interface';
import { CustomRequest } from '../interfaces/customRequest.interface';
import { UserRoleEnum } from '../utils/enums/user-role.enum';
import { DocTypeEnum } from '../utils/enums/doc-type.enum';
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
} from '../services/document.service';
import {
  addCoordinateService,
  getAllCoordinates,
  getCoordinateById,
} from '../services/coordinate.service';
import {
  getUsers,
  createUser,
  login,
  getMe,
} from '../controllers/user.controllers';
import {
  addDocumentController,
  getAllDocumentsController,
  getDocumentByIdController,
  updateDocumentController,
  getDocumentsByTypeController,
} from '../controllers/document.controllers';
import {
  addCoordinate,
  getAllCoordinatesController,
  getCoordinateByIdController,
} from '../controllers/coordinate.controllers';
import { CustomError } from '../utils/customError';
import {
  BadConnectionError,
  DocNotFoundError,
  PositionError,
} from '@utils/errors';

jest.mock('../services/user.service'); //For suite n#1
jest.mock('../services/document.service'); //For suite n#2
jest.mock('../services/coordinate.service'); //For suite n#3

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
          role: UserRoleEnum.Visitor
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
      expect(res.json).toHaveBeenCalledWith({
        message: 'Document added successfully',
        document: mockNewDocument,
      });
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
      const err = new DocNotFoundError();

      jest
        .spyOn(require('../services/document.service'), 'getDocumentById')
        .mockImplementation(async () => {
          throw err;
        });

      await getDocumentByIdController(req as Request, res as Response, next);

      expect(getDocumentById).toHaveBeenCalledWith('1');
      expect(next).toHaveBeenCalledWith(err);
    });

    //test 3
    test('Should return an error if the connection to the DB fails', async () => {
      const err = new BadConnectionError();

      jest
        .spyOn(require('../services/document.service'), 'getDocumentById')
        .mockImplementation(async () => {
          throw err;
        });

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
    test('Should throw a DocNotFoundError when no documents found', async () => {
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

  //"deleteDocumentController" is a test method, it isn't implemented in the application
  //due to this reason it is not tested
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

  //"deleteCoordinateController" is a test method, it isn't implemented in the application
  //due to this reason it is not tested
}); //END OF COORDINATE CONTROLLERS
