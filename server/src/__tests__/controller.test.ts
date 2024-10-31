import { jest, describe, expect, beforeEach } from '@jest/globals'
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { IUserResponse } from '@interfaces/user.return.interface';
import { IUser } from '../interfaces/user.interface';
import User from '../schemas/user.schema';
import { Request, Response, NextFunction } from 'express';
import { CustomRequest } from '@interfaces/customRequest.interface';
import { UserRoleEnum } from "@utils/enums/user-role.enum";
import { getAllUsers, createNewUser, getUserById, loginUser } from '../services/user.service';
import { getUsers, createUser } from "../controllers/user.controllers";
import { CustomError } from '@utils/customError';
import { DocTypeEnum } from '@utils/enums/doc-type.enum';

jest.mock("../services/user.service");

//Suite n#1 - USER
describe("Tests for user controllers", () => {
    //Mock of the objects that will be use to test controllers
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    //Code to clear each mocked data used
    beforeEach(() => {
        req = {};
        res = { json: jest.fn(), } as Partial<Response>;
        next = jest.fn();
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
        });

        //test 2
        test("Should return an error", async () => {
        });
    });//login
    /* ************************************************** */

    //getMe
    describe("Tests for getMe", () => {
        //test 1
        test("Should successfully retrieve the infos of a logged user", async () => {
        });

        //test 2
        test("Should return an error", async () => {
        });
    });//getMe
});//END OF USER CONTROLLERS