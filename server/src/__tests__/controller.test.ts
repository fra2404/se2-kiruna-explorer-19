import { Request, Response, NextFunction } from "express";
import { jest, describe, expect, beforeEach } from '@jest/globals'

import { IUserResponse } from '../interfaces/user.return.interface';
import { IDocumentResponse } from '@interfaces/document.return.interface';
import { CustomRequest } from '../interfaces/customRequest.interface';
import { UserRoleEnum } from "../utils/enums/user-role.enum";
import { DocTypeEnum } from "../utils/enums/doc-type.enum";
import { getAllUsers, createNewUser, loginUser } from '../services/user.service';
import { getUsers, createUser, login, getMe } from "../controllers/user.controllers";
import { CustomError } from '../utils/customError';
import { addDocument, getDocuments, getDocument, updateDocument } from "../controllers/document.controllers";
import { addingDocument, getAllDocuments, getDocumentById, updatingDocument } from "../services/document.service";
import { BadConnectionError, DocNotFoundError } from "@utils/errors";

jest.mock("../services/user.service"); //For suite n#1
jest.mock('../services/document.service'); //For suite n#2

/* ******************************************* Suite n#1 - USERS ******************************************* */
describe("Tests for user controllers", () => {
    //Mock of the objects that will be use to test controllers
    let req: Partial<CustomRequest>;
    let res: Partial<Response>;
    let next: NextFunction;

    //Code to clear each mocked data used
    beforeEach(() => {
        req = {};
        res = { json: jest.fn(), } as Partial<Response>;
        next = jest.fn();

        jest.clearAllMocks();
    });
    /* ************************************************** */

    //getUsers
    describe("Tests for getUsers", () => {
        //test 1
        test("Should respond with a list of users", async () => {
            //Data mocking
            const mockUsers: IUserResponse[] = [{ 
                id: '1', 
                name: 'Daniele', 
                email: 'dani@ex.com', 
                surname: 'De Rossi', 
                phone: '123456789', 
                role: UserRoleEnum.Visitor },
                { 
                id: '1', 
                name: 'Pippo', 
                email: 'pippo@ex.com', 
                surname: 'Baudo', 
                phone: '987654321', 
                role: UserRoleEnum.Uplanner },
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
            const err = new Error("An error occurred with the DB");

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
    });//getUsers
    /* ************************************************** */

    //createUser
    describe("Tests for createUser", () => {
        //test 1
        test("Should successfully create a new user", async () => {
            //Data mocking
            req = {
                body: { 
                    name: 'Lautaro', 
                    email: 'lautaro@ex.com', 
                    password: 'password123', 
                    surname: 'Martinez', 
                    phone: '123456789', 
                    role: UserRoleEnum.Visitor 
                }
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
            
            const err = new CustomError("Password is required", 400);
    
            //Support functions mocking
            jest.spyOn(require("../services/user.service"), "createNewUser")
            .mockImplementation(async () => { throw err; });
    
            //Call of createUser
            await createUser(req as Request, res as Response, next);
    
            expect(next).toHaveBeenCalledWith(err);
            expect(next).toHaveBeenCalledTimes(1);
            expect(res.status).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
        });
    });//createUser
    /* ************************************************** */

    //login
    describe("Tests for login", () => {
        //test 1
        test("Should successfully log a registered user", async () => {
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

            const fakeToken = "fake_token_value";

            //Support functions mocking
            (loginUser as jest.Mock).mockImplementation(async () => ({token: fakeToken}));

            //Call of login
            await login(req as CustomRequest, res as Response, next);

            expect(loginUser).toHaveBeenCalledWith(req.body.email, req.body.password);
            expect(res.cookie).toHaveBeenCalledWith('auth-token', fakeToken, cookie_settings);
            expect(res.json).toHaveBeenCalledWith({ token: fakeToken });
        });

        //test 2
        test("Should return an error", async () => {
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

            const fakeToken = "fake_token_value";
            const err = new CustomError("Login has failed", 400);

            //Support functions mocking
            jest.spyOn(require("../services/user.service"), "loginUser")
            .mockImplementation(async () => { throw err; });

            //Call of login
            await login(req as CustomRequest, res as Response, next);

            expect(next).toHaveBeenCalledWith(err);
            expect(res.cookie).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
        });
    });//login
    /* ************************************************** */

    //getMe
    describe("Tests for getMe", () => {
        //test 1
        test("Should successfully retrieve the infos of a logged user", async () => {
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
        test("Should return an error", async () => {
            //Data mocking
            req = {} as Partial<CustomRequest>;
            const err = new CustomError('User not authenticated', 401);

            //Call of getMe
            await getMe(req as CustomRequest, res as Response, next);

            expect(next).toHaveBeenCalledWith(err);
            expect(res.json).not.toHaveBeenCalled();
        });
    });//getMe
});//END OF USER CONTROLLERS

/* ******************************************* Suite n#2 - DOCUMENTS ******************************************* */
describe("Tests for document controller", () => {
    //addDocument
    describe("Tests for addDocument", () => {
        let req: Partial<Request>;
        let res: Partial<Response>;
        let next: NextFunction;

        beforeEach(() => {
            req = {
                body: {
                    title: 'Test Document',
                    stakeholders: ['Stakeholder1', 'Stakeholder2'],
                    scale: '1:1000',
                    type: 'agreement',
                    connections: ['Document1', 'Document2'],
                    language: 'EN',
                    media: ['Media1', 'Media2'],
                    coordinates: [10, 20],
                    summary: 'Test summary',
                },
            };
    
            res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            } as Partial<Response>;
    
            next = jest.fn();
        });

        //test 1
        test("Should return a new document", async () => {
            (addingDocument as any).mockResolvedValue(req.body);

            await addDocument(req as Request, res as Response, next);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: req.body
            })
        });

        //test 2
        test("Should handle errors", async () => {
            const error = "Error: something went wrong";
            (addingDocument as any).mockRejectedValue(error);

            await addDocument(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(error);
            expect(res.status).toHaveBeenCalledWith(500);
        })

        //test 3
        test("Should handle empty documets", async () => {
            req.body = {}

            await addDocument(req as Request, res as Response, next);

            expect(next).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(500);
        })
    });//addDocument
    /* ************************************************** */

    //getDocuments
    describe("Tests for getDocuments", () => {
        let req: Partial<Request>;
        let res: Partial<Response>;
        let next: NextFunction;

        const documents = [
            {
                title: 'Test Document',
                stakeholders: ['Stakeholder1', 'Stakeholder2'],
                scale: '1:1000',
                type: 'AGREEMENT',
                connections: ['Document1', 'Document2'],
                language: 'EN',
                media: ['Media1', 'Media2'],
                coordinates: [10, 20],
                summary: 'Test summary',
            },
            {
                title: 'Test Document 2',
                stakeholders: ['Stakeholder1'],
                scale: '1:10000',
                type: 'TECHNICAL_DOC',
                connections: ['Document1', 'Document2'],
                language: 'EN',
                media: ['Media1', 'Media2'],
                coordinates: [10, 20],
                summary: 'Test summary',
            }
        ]

        beforeEach(() => {
            req = {
                body: {},
            };
    
            res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            } as Partial<Response>;
    
            next = jest.fn();
        });

        //test 1
        test("Should return all documents", async () => {
            (getAllDocuments as any).mockResolvedValue(documents);

            await getDocuments(req as Request, res as Response, next);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: documents
            })
        });

        //test 2
        test("Should return 404 error (no documents)", async () => {
            (getAllDocuments as any).mockResolvedValue([]);

            await getDocuments(req as Request, res as Response, next);

            expect(res.status).toHaveBeenCalledWith(404);
        });
    });//getDocuments
    /* ************************************************** */

    //getDocument
    describe("Tests for getDocument", () => {
        let req: Partial<Request>;
        let res: Partial<Response>;
        let next: NextFunction;

        beforeEach(() => {
            req = {
            params: { id: '1' }
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as Partial<Response>;

        next = jest.fn();
        });

        //test 1
        test("Should return 201 and the document if found", async () => {
            //Data mocking
            const mockDocument: IDocumentResponse = { 
                id: "1",
                title: "Test title 1", 
                stakeholders: "Company A", 
                scale: "Test value 1", 
                type: DocTypeEnum.Agreement, 
                date: "01-01-2000", 
                connections: undefined,
                language: "Italian",
                media: undefined,
                coordinates: null,
                summary: "Test summary 1" 
            };
    
            //Support functions mock
            (getDocumentById as jest.Mock).mockImplementation(async () => mockDocument);
    
            //Call of getDocument
            await getDocument(req as Request, res as Response, next);
    
            expect(getDocumentById).toHaveBeenCalledWith('1');
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ success: true, data: mockDocument });
        });

        //test 2
        test("Should return an error if the document is not found", async () => {
            const err = new DocNotFoundError();
            
            jest.spyOn(require("../services/document.service"), "getDocumentById")
            .mockImplementation(async () => { throw err; });
    
            await getDocument(req as Request, res as Response, next);
    
            expect(getDocumentById).toHaveBeenCalledWith('1');
            expect(next).toHaveBeenCalledWith(err);
        });

        //test 3
        test("Should return an error if the connection to the DB fails", async () => {
            const err = new BadConnectionError();
            
            jest.spyOn(require("../services/document.service"), "getDocumentById")
            .mockImplementation(async () => { throw err; });
    
            await getDocument(req as Request, res as Response, next);
    
            expect(getDocumentById).toHaveBeenCalledWith('1');
            expect(next).toHaveBeenCalledWith(err);
        });
    });//getDocument
    /* ************************************************** */

    //updateDocument
    describe("Tests for updateDocument", () => {
        let req: Partial<Request>;
        let res: Partial<Response>;
        let next: NextFunction;
    
        beforeEach(() => {
            req = {
                params: { id: '1' },
                body: {
                    title: "Test document",
                    stakeholders: "Company A",
                    scale: "Test value",
                    type: DocTypeEnum.Agreement,
                    date: "01-01-2000",
                    summary: "Tets summary updated"
                }
            };
    
            res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            } as Partial<Response>;
    
            next = jest.fn();
        });
    
        //test 1
        test("Should complete the update and return 200", async () => {
            //Data mocking
            const mockUpdatedDocument: IDocumentResponse = {
                id: '1',
                title: "Test document",
                stakeholders: "Company A",
                scale: "Test value",
                type: DocTypeEnum.Agreement,
                date: "01-01-2000",
                summary: "Tets summary updated"
            };
    
            //Support functions mocking
            (updatingDocument as jest.Mock).mockImplementation(async () => mockUpdatedDocument);
    
            //Call of updateDocument
            await updateDocument(req as Request, res as Response, next);
    
            expect(updatingDocument).toHaveBeenCalledWith('1', req.body);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ success: true, data: mockUpdatedDocument });
        });
    
        //test 2
        test("Should return an error as the document is not found", async () => {
            //Support functions mocking
            //NOTE:
            //The service "updatingDocument" was not designed to throw a "DocNotFoundError"
            //So the document is "not found" if an empty object (aka a null object) is returned by the method
            (updatingDocument as jest.Mock).mockImplementation(async () => null);
    
            await updateDocument(req as Request, res as Response, next);
    
            expect(updatingDocument).toHaveBeenCalledWith('1', req.body);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Document not found' });
        });
    
        //test 3
        it("Should return an error as the connection with the database fails", async () => {
            //Data mocking
            const err = new BadConnectionError();

            //Support functions mocking
            jest.spyOn(require("../services/document.service"), "updatingDocument")
            .mockImplementation(async () => { throw err; });
    
            await updateDocument(req as Request, res as Response, next);
    
            expect(updatingDocument).toHaveBeenCalledWith('1', req.body);
            expect(next).toHaveBeenCalledWith(err);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Server Error' });
        });
    });//updateDocument
});//END OF DOCUMENT CONTROLLERS