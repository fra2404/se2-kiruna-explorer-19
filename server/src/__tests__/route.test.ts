//READ ME:
/*
Because of the complexity of unit testing the routes, it was decided to test them just with the integration testing.
For this reason this file's suite won't be runned along with the others.
For more informations go check the "jest.config.js" were the path of this suite was excluded.
*/

import express from 'express';
import request from 'supertest';
import { Request, Response, NextFunction } from 'express';

import { app } from '../app';
import router from '../routes/routes';
import { authenticateUser } from '@middlewares/auth.middleware';
import { authorizeRoles } from '@middlewares/role.middleware';
import { handleValidationErrors } from '@middlewares/validation.middleware';
import { userRoutes } from '../routes/user.routes';
import { documentRoutes } from '../routes/document.routes';
import { coordinateRoutes } from '../routes/coordinate.routes';

import { UserRoleEnum } from '@utils/enums/user-role.enum';
import { CustomRequest } from '../interfaces/customRequest.interface';

import {
  createUser,
  getUsers,
  getMe,
  login,
  logout,
  deleteUser,
} from '@controllers/user.controllers';

import {
  validateUserLogin,
  validateUserSignUp,
} from '@utils/validators/user.validator';
import { validateAddDocument } from '@utils/validators/document.validator';

const testDocument = {
  id: '1',
  title: 'test',
  stakeholders: 'LKAB',
  scale: '1:1000',
  type: 'AGREEMENT',
  connections: [],
  language: 'EN',
  summary: 'This is a summary of the document.',
  date: '2024-11-16',
  coordinates: '',
  media: [],
};

//Mocks of routes modules
jest.mock('../routes/user.routes', () => {
  const router = require('express').Router();
  router.get('/', (req: Request, res: Response) =>
    res.status(200).send('User Route'),
  );
  return {
    userRoutes: router,
  };
}); //For suite n#0

jest.mock('../routes/document.routes', () => {
  const router = require('express').Router();
  router.post('/create', (req: Request, res: Response) =>
    res.status(200).send(testDocument),
  );
  router.get('/', (req: Request, res: Response) =>
    res.status(200).send('Document Route'),
  );
  router.get('/:id', (req: Request, res: Response) =>
    res.status(200).send(testDocument),
  );
  router.put('/:id', (req: Request, res: Response) =>
    res.status(200).send(testDocument),
  );
  return {
    documentRoutes: router,
  };
}); //For suite n#0

jest.mock('../routes/coordinate.routes', () => {
  const router = require('express').Router();
  router.get('/', (req: Request, res: Response) =>
    res.status(200).send('Coordinate Route'),
  );
  return {
    coordinateRoutes: router,
  };
}); //For suite n#0

jest.mock('@controllers/user.controllers', () => ({
  createUser: jest.fn(),
  getUsers: jest.fn(),
  getMe: jest.fn(),
  login: jest.fn(),
  logout: jest.fn(),
  deleteUser: jest.fn(),
}));

jest.mock('@controllers/document.controllers', () => ({
  getAllDocumentsController: jest.fn(),
  searchDocumentsController: jest.fn(),
  getDocumentByIdController: jest.fn(),
  updateDocumentController: jest.fn(),
  getDocumentTypesController: jest.fn(),
  getDocumentsByTypeController: jest.fn(),
  deleteDocumentController: jest.fn(),
  addDocumentController: jest.fn(),
}));

jest.mock('@middlewares/auth.middleware', () => ({
  authenticateUser: jest.fn((req: Request, res: Response, next: NextFunction) =>
    next(),
  ),
}));

jest.mock('@middlewares/role.middleware', () => ({
  authorizeRoles: jest.fn(
    (...roles) =>
      (req: Request, res: Response, next: NextFunction) =>
        next(),
  ),
}));

jest.mock('@middlewares/validation.middleware', () => ({
  handleValidationErrors: jest.fn(
    (req: Request, res: Response, next: NextFunction) => next(),
  ),
}));

jest.mock('@utils/validators/document.validator', () => ({
  validateAddDocument: jest.fn(),
}));

jest.mock('@utils/validators/user.validator', () => ({
  validateUserLogin: jest.fn(),
  validateUserSignUp: jest.fn(),
}));

/* ******************************************* Suite n#0 - MAIN ******************************************* */
describe.skip('Tests for the main routes', () => {
  //Resources restoring
  beforeEach(() => {
    app.use('/', router);
  });

  //User path
  test('Should use userRoutes for navigating /users', async () => {
    //http request mock
    const response = await request(app).get('/users');

    expect(response.status).toBe(200);
    expect(response.text).toBe('User Route');
  }); //User path
  /* ************************************************** */

  //Document path
  test('Should use documentRoutes for navigating /documents', async () => {
    //http request mock
    const response = await request(app).get('/documents');

    expect(response.status).toBe(200);
    expect(response.text).toBe('Document Route');
  }); //Document path
  /* ************************************************** */

  //Coordinate path
  test('Should use coordinateRoutes for navigating /coordinates', async () => {
    //http request mock
    const response = await request(app).get('/coordinates');

    expect(response.status).toBe(200);
    expect(response.text).toBe('Coordinate Route');
  }); //Coordinate path
  /* ************************************************** */
}); //END OF MAIN ROUTES

/* ******************************************* Suite n#1 - USER ******************************************* */
describe.skip('Tests for user routes', () => {
  //Mock of the objects that will be use to test controllers
  let req: Partial<CustomRequest>;
  let res: Partial<Response>;
  let next: NextFunction;

  //Code to clear each mocked data used
  beforeEach(() => {
    jest.clearAllMocks();
  });

  //GET#1 - retrive all users
  test('Should return users list', async () => {
    //http request mock
    const response = await request(app).get('/users');

    expect(response.status).toBe(200);
    expect(response.text).toBe('User Route');
  }); //GET#1
  /* ************************************************** */

  /*
    //POST#1 - signup a user
    test("Should create a user", async () => {
    });//POST#1

    //POST#2 - login a user
    test("Should log in a user", async () => {
    });//POST#2

    //POST#3 - logout a user
    test("Should log out a user", async () => {
    });//POST#3

    //GET#2 - user info
    test("Should return the informations of a logged user", async () => {
    });//GET#2
    */

  //The delete route was developed for testing purpose, so it won't be tested
}); //END OF USER ROUTES

/* ******************************************* Suite n#2 - DOCUMENT ******************************************* */
describe.skip('Tests for document routes', () => {
  //Mock of the objects that will be use to test controllers
  let req: Partial<CustomRequest>;
  let res: Partial<Response>;
  let next: NextFunction;

  //Code to clear each mocked data used
  beforeEach(() => {
    jest.clearAllMocks();
    app.use('/api/users', userRoutes);
    app.use('/api/documents', documentRoutes);
    app.use('/api/coordinates', coordinateRoutes);
  });

  //POST#1 - Add a new document
  test('Should add a new document', async () => {
    //http request mock
    const response = await request(app)
      .post('/api/documents/create')
      .send(testDocument);

    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(testDocument);
  }); //POST#1

  //GET#1 - Get all documents
  test('Should return all documents', async () => {
    //http request mock
    const response = await request(app).get('/api/documents/');

    expect(response.status).toBe(200);
    expect(response.text).toBe('Document Route');
  }); //GET#1

  //GET#2 - Get the document with the specified ID
  test('Should return the document with the specified ID', async () => {
    //http request mock
    const response = await request(app).get('/api/documents/1');

    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(testDocument);
  }); //GET#2

  //PUT#1 - Update a document
  test('Should return the document with the specified ID', async () => {
    //http request mock
    const response = await request(app).put('/api/documents/1');

    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(testDocument);
  }); //PUT#1
}); //END OF DOCUMENT ROUTES

/* ******************************************* Suite n#3 - COORDINATE ******************************************* */
