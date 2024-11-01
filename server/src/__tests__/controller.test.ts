import { Request, Response, NextFunction } from "express";
import { jest, describe, expect, beforeEach } from '@jest/globals'

import { IUserResponse } from '@interfaces/user.return.interface';
import { CustomRequest } from '@interfaces/customRequest.interface';
import { UserRoleEnum } from "@utils/enums/user-role.enum";
import { getAllUsers, createNewUser, loginUser } from '../services/user.service';
import { getUsers, createUser, login, getMe } from "../controllers/user.controllers";
import { CustomError } from '@utils/customError';
import { addDocument } from "@controllers/document.controllers";
import { addingDocument } from "@services/document.service";

jest.mock("../services/user.service");

jest.mock('../services/document.service');

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
            };
    
            next = jest.fn();
        });

        test("Should return a new document", async () => {
            (addingDocument as jest.Mock).mockResolvedValue(req.body);

            await addDocument(req as Request, res as Response, next);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: req.body
            })
        });

        test("Should handle errors", async () => {
            const error = "Error: something went wrong";
            (addingDocument as jest.Mock).mockRejectedValue(error);

            await addDocument(req as Request, res as Response, next);

            expect(next).toHaveBeenCalledWith(error);
            expect(res.status).toHaveBeenCalledWith(500);
        })

        /**
         * Tests to be written:
         *  Empty document
         *  Document with some NULL fields
         *  Invalid values on fields (see cards)
        */
    });
});
