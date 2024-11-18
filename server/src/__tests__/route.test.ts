import express from "express";
import request from "supertest";
import { Request, Response, NextFunction } from "express";

import { app } from "../app";
import router from "../routes/routes";
import { authenticateUser } from '@middlewares/auth.middleware';
import { authorizeRoles } from '@middlewares/role.middleware';
import { handleValidationErrors } from '@middlewares/validation.middleware';
import { userRoutes } from "../routes/user.routes";
import { documentRoutes } from "../routes/document.routes";
import { coordinateRoutes } from "../routes/coordinate.routes";

import { UserRoleEnum } from "@utils/enums/user-role.enum";
import { CustomRequest } from '../interfaces/customRequest.interface';

import {
    createUser,
    getUsers,
    getMe,
    login,
    logout,
    deleteUser,
} from "@controllers/user.controllers";

import {
  validateUserLogin,
  validateUserSignUp,
} from '@utils/validators/user.validator';

//Mocks of routes modules
jest.mock("../routes/user.routes", () => {
    const router = require("express").Router();
    router.get("/", (req: Request, res: Response) => res.status(200).send("User Route"));
    return {
        userRoutes: router
    };
}); //For suite n#0 

jest.mock("../routes/document.routes", () => {
    const router = require("express").Router();
    router.get("/", (req: Request, res: Response) => res.status(200).send("Document Route"));
    return {
        documentRoutes: router
    };
}); //For suite n#0 

jest.mock("../routes/coordinate.routes", () => {
    const router = require("express").Router();
    router.get("/", (req: Request, res: Response) => res.status(200).send("Coordinate Route"));
    return {
        coordinateRoutes: router
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

jest.mock('@middlewares/auth.middleware', () => ({
    authenticateUser: jest.fn((req: Request, res: Response, next: NextFunction) => next()),
}));

jest.mock('@middlewares/role.middleware', () => ({
    authorizeRoles: jest.fn((...roles) => (req: Request, res: Response, next: NextFunction) => next())
}));

jest.mock('@middlewares/validation.middleware', () => ({
    handleValidationErrors: jest.fn((req: Request, res: Response, next: NextFunction) => next())
}));

jest.mock('@utils/validators/user.validator', () => ({
    validateUserLogin: jest.fn(),
    validateUserSignUp: jest.fn()
}));

/* ******************************************* Suite n#0 - MAIN ******************************************* */
describe("Tests for the main routes", () => {
    //Resources restoring
    beforeEach(() => {
        app.use("/", router);
    });

    //User path
    test("Should use userRoutes for navigating /users", async () => {
        //http request mock
        const response = await request(app).get("/users");
        
        expect(response.status).toBe(200);
        expect(response.text).toBe("User Route");
    });//User path
    /* ************************************************** */

    //Document path
    test("Should use documentRoutes for navigating /documents", async () => {
        //http request mock
        const response = await request(app).get("/documents");
        
        expect(response.status).toBe(200);
        expect(response.text).toBe("Document Route");
    });//Document path
    /* ************************************************** */

    //Coordinate path
    test("Should use coordinateRoutes for navigating /coordinates", async () => {
        //http request mock
        const response = await request(app).get("/coordinates");
        
        expect(response.status).toBe(200);
        expect(response.text).toBe("Coordinate Route");
    });//Coordinate path
    /* ************************************************** */
});//END OF MAIN ROUTES

/* ******************************************* Suite n#1 - USER ******************************************* */
describe("Tests for user routes", () => {
    //Mock of the objects that will be use to test controllers
    let req: Partial<CustomRequest>;
    let res: Partial<Response>;
    let next: NextFunction;

    //Code to clear each mocked data used
    beforeEach(() => {
        jest.clearAllMocks();
    });

    //GET#1 - retrive all users
    test("Should return users list", async () => {
        //http request mock
        const response = await request(app).get("/users");

        expect(response.status).toBe(200);
        expect(response.text).toBe("User Route");
    });//GET#1
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
});//END OF USER ROUTES

/* ******************************************* Suite n#2 - DOCUMENT ******************************************* */
/* ******************************************* Suite n#3 - COORDINATE ******************************************* */