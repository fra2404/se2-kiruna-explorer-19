import { jest, describe, expect } from "@jest/globals"
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import User from "../schemas/user.schema";
import Document from "../schemas/document.schema";
import { Coordinate } from "../schemas/coordinate.schema";
import { IUser } from "../interfaces/user.interface";
import { IDocument } from "../interfaces/document.interface"; 
import { ICoordinate } from "../interfaces/coordinate.interface";
import { UserRoleEnum } from "../utils/enums/user-role.enum";
import { DocTypeEnum } from "../utils/enums/doc-type.enum";
import { getAllUsers, createNewUser, getUserById, loginUser } from "../services/user.service";
import { addingDocument, getAllDocuments, getDocumentById, updatingDocument, deleteDocumentByName, getDocumentByType } from "../services/document.service";
import { addCoordinateService, getAllCoordinates, getCoordinateById } from "@services/coordinate.service";

import { CustomError } from "../utils/customError";
import { UserNotAuthorizedError } from "../utils/errors";
import { PositionError } from "@utils/errors";

//MOCKS
jest.mock("../schemas/user.schema"); //suite n#1
jest.mock("../schemas/document.schema"); //suite n#2
jest.mock("../schemas/coordinate.schema"); //suite n#3
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

/* ******************************************* Suite n#1 - USERS ******************************************* */
describe("Tests for user services", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    
    //getAllUsers
    describe("Tests for getAllUsers", () => {
        //test 1
        test("Should return all users", async () => {
            //Data mocking
            const mockUsers = [
                {
                    id: "1",
                    name: "Sergio",
                    email: "sergio@ex.com",
                    surname: "Cicero",
                    phone: "123456789",
                    role: UserRoleEnum.Visitor,
                },
                {
                    id: "2",
                    name: "Francesco",
                    email: "francesco@ex.com",
                    surname: "Albano",
                    phone: "987654321",
                    role: UserRoleEnum.Resident,
                },
            ];

            //Support functions mocking
            const findMock = jest.spyOn(User, "find").mockResolvedValue(mockUsers as any);

            //Call of getAllUsers
            const result = await getAllUsers();

            //Checking results
            expect(result).toEqual([
                {
                    id: "1",
                    name: "Sergio",
                    email: "sergio@ex.com",
                    surname: "Cicero",
                    phone: "123456789",
                    role: UserRoleEnum.Visitor,
                },
                {
                    id: "2",
                    name: "Francesco",
                    email: "francesco@ex.com",
                    surname: "Albano",
                    phone: "987654321",
                    role: UserRoleEnum.Resident,
                },
            ]);

            expect(User.find).toHaveBeenCalledTimes(1);
            findMock.mockRestore();
        });
    });//getAllUsers
    /* ************************************************** */

    //createNewUser
    describe("Tests for createNewUser", () => {
        //test 1
        test("Should create a new user", async () => {
            //Data mocking
            const mockUser: IUser = {
                name: "Sergio",
                email: "sergio@ex.com",
                password: "password123",
                surname: "Cicero",
                phone: "123456789",
                role: UserRoleEnum.Visitor,
            };

            //Encrypting functions mocking
            const saltMock = jest.spyOn(bcrypt, "genSalt").mockImplementation(async () => "fakeSalt");
            const hashMock = jest.spyOn(bcrypt, "hash").mockImplementation(async () => "fakeHashedPassword");
            const saveMock = jest.spyOn(User.prototype, "save").mockResolvedValueOnce({});

            //Call of createNewUser
            const result = await createNewUser(mockUser);

            //Checking results
            expect(result).toBe("User created successfully");
            expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
            expect(bcrypt.hash).toHaveBeenCalledWith("password123", "fakeSalt");
            expect(saveMock).toHaveBeenCalledTimes(1);

            saltMock.mockRestore();
            hashMock.mockRestore();
            saveMock.mockRestore();
        });

        //test 2
        test("Should return an error because of the absence of a password", async () => {
            //Data mocking
            const mockUser: IUser = {
                name: "Sergio",
                email: "sergio@ex.com",
                password: "",
                surname: "Cicero",
                phone: "123456789",
                role: UserRoleEnum.Visitor,
            };

            //Call of createNewUser
            await expect(createNewUser(mockUser)).rejects.toThrow(CustomError);
            await expect(createNewUser(mockUser)).rejects.toThrow("Password is required");
        });
    });//createNewUser
    /* ************************************************** */

    //getUserById
    describe("Tests for getUserById", () => {
        //test 1
        test("Should return a user", async () => {
            //Data mocking
            const mockUser = {
                id: "1",
                name: "Diego",
                email: "diego@ex.com",
                surname: "Porto",
                phone: "123456789",
                role: UserRoleEnum.Uplanner,
            };

            //Support functions mocking
            const findMock = jest.spyOn(User, "findById").mockResolvedValue(mockUser as any);

            //Call of getUserById
            const result = await getUserById("1");

            //Checking results
            expect(result).toEqual({
                id: "1",
                name: "Diego",
                email: "diego@ex.com",
                surname: "Porto",
                phone: "123456789",
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
            const result = await getUserById("AAA");

            expect(result).toBeNull();
        });
    });//getUserById
    /* ************************************************** */

    //loginUser
    describe("Tests for loginUser", () => {
        const wrongMockMail = "lautaro@ex.com";
        const wrongMockPassword = "password123";
        
        //test 1
        test("Should successfully log a user", async () => {
            //Data mocking
            const mockUser = {
                _id: "1",
                name: "Sergio",
                email: "sergio@ex.com",
                surname: "Cicero",
                phone: "123456789",
                password: "hashed-password",
                role: UserRoleEnum.Visitor,
            };

            const choosenEmailMock = "sergio@ex.com";
            const choosenPassMock = "password12";
            const fakeToken = "fake_token_value";
        
            //Support functions mocking
            (User.findOne as jest.Mock).mockImplementation(async() => mockUser);
            (bcrypt.compare as jest.Mock).mockImplementation(async() => true);
            (jwt.sign as jest.Mock).mockReturnValue(fakeToken);

            //Call of loginUser
            const result = await loginUser(choosenEmailMock, choosenPassMock);

            expect(result).toEqual({ token: fakeToken });
            expect(User.findOne).toHaveBeenCalledWith({ email: choosenEmailMock });
            expect(bcrypt.compare).toHaveBeenCalledWith(choosenPassMock, mockUser.password);
            expect(jwt.sign).toHaveBeenCalledWith(
                { id: mockUser._id, email: mockUser.email, role: mockUser.role },
                expect.any(String),
                { expiresIn: "1h" }
            ); 
        });

        //test 2
        test("Should throw UserNotAuthorizedError if the mail is wrong", async () => {
            //Data mocking
            const err = new UserNotAuthorizedError();

            //Support functions mocking
            (User.findOne as jest.Mock).mockImplementation(async() => null);
    
            //Call of loginUser
            await expect(loginUser(wrongMockMail, wrongMockPassword)).rejects.toThrow(err);

            expect(User.findOne).toHaveBeenCalledWith({ email: wrongMockMail });
        });

        //test 3
        test("Should throw UserNotAuthorizedError if the password is wrong", async () => {
            //Data mocking
            const err = new UserNotAuthorizedError();
            const mockUserInputs = { email: wrongMockMail, password: "hashed-value" };

            (User.findOne as jest.Mock).mockImplementation(async() => mockUserInputs);
            (bcrypt.compare as jest.Mock).mockImplementation(async() => false);
    
            await expect(loginUser(wrongMockMail, wrongMockPassword)).rejects.toThrow(err);
            expect(User.findOne).toHaveBeenCalledWith({ email: wrongMockMail });
            expect(bcrypt.compare).toHaveBeenCalledWith(wrongMockPassword, "hashed-value");
        });
    });//loginUser
});//END OF USER SERVICES

/* ******************************************* Suite n#2 - DOCUMENTS ******************************************* */

//README!!!!!!!!!!!!!!!!
//DOCUMENT SERVICES WERE DEEPLY CHANGED DUE TO APPLICATION CONFLICTS WITH THEIR FIRST VERSION
//BECAUSE OF THIS REASON THE FOLLOWING TESTS WERE ALL DELETED
//TO RETRIVE PAST VERSION OF DOCUMENT SERVICES TESTS, OLD COMMITS CAN BE CONSULTED

describe("Tests for document services", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    //addingDocument
    describe("Tests for addingDocument", () => {
        //test 1
        test("Should successfully save a new document and updating the db entries related to him", async () => {
        });

        //test 2
        test("Should throw a PositionError", async () => {
        });

        //test 3
        test("Should throw a DocNotFoundError", async () => {
        });
    });//addingDocument
    /* ************************************************** */

    //getAllDocuments
    describe("Tests for getAllDocuments", () => {
        //test 1
        test("Should return all the documents and associated coordinates", async () => {
        });

        //test 2
        test("Should only return documents if there aren't associations", async () => {
        });
    });//getAllDocuments
    /* ************************************************** */

    //getDocumentById
    //updatingDocument
    //deleteDocumentByName
    //getDocumentByType
});//END OF CONTROLLER SERVICES

/* ******************************************* Suite n#3 - COORDINATES ******************************************* */
describe("Tests for coordinate services", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    //getCoordinateById
    describe("Tests for getCoordinateById", () => {
        //Input mocking
        const coordinateId = "1";

        //test 1
        test("Should successfully retrieve a coordinate object", async () => {
            //Data mocking
            const mockCoordinate = {
                id: coordinateId,
                type: "Point",
                coordinates: [45.123, 7.123],
                name: "Test coordinate",
            };

            //Support functions mocking
            jest.spyOn(Coordinate, "findById").mockResolvedValue({toObject: () => mockCoordinate});

            //Call of getCoordinateById
            const result = await getCoordinateById(coordinateId);

            expect(Coordinate.findById).toHaveBeenCalledWith(coordinateId);
            expect(result).toEqual(mockCoordinate);
        });

        //test 2
        test("Should return null if the coordinate is not found", async () => {
            //Support functions mocking
            (Coordinate.findById as jest.Mock).mockImplementation(async () => null);
    
            //Call of getCoordinateById
            const result = await getCoordinateById(coordinateId);
    
            expect(Coordinate.findById).toHaveBeenCalledWith(coordinateId);
            expect(result).toBeNull();
        });

        //test 3
        test("Should throw an error if the connection with the DB fails", async () => {
            //Data mocking
            const err = new CustomError("Internal Server Error", 500);
            
            //Support functions mocking
            (Coordinate.findById as jest.Mock).mockImplementation(async () => err);
    
            //getCoordinateById
            await expect(getCoordinateById(coordinateId)).rejects.toThrow(err);

            expect(Coordinate.findById).toHaveBeenCalledWith(coordinateId);
        });
    });//getCoordinateById
    /* ************************************************** */

    //addCoordinateService
    describe("Tests for addCoordinateService", () => {
        //Input mocking
        const mockCoordinate = {
            type: "Point",
            coordinates: [45.123, 7.123],
            name: "Test coordinate",
        } as ICoordinate;

        //test 1
        test("Should successfully save a new coordinate", async () => {
            //Support functions mocking
            (Coordinate.prototype.save as jest.Mock).mockImplementation(async () => mockCoordinate);
            (Coordinate.prototype.toObject as jest.Mock).mockReturnValueOnce(mockCoordinate);

            //Call of addCoordinateService
            const result = await addCoordinateService(mockCoordinate);

            expect(Coordinate.prototype.save).toHaveBeenCalled();
            expect(result).toEqual(mockCoordinate);
        });

        //test 2
        test("Should throw an error if the connection with the DB fails", async () => {
            //Data mocking
            const err = new CustomError("Internal Server Error", 500);
            
            //Support functions mocking
            jest.spyOn(Coordinate.prototype, "save").mockRejectedValue(err);
            //The code interrupts before "toObject" is called, so there is no need to test its call
    
            //Call of addCoordinateService
            await expect(addCoordinateService(mockCoordinate)).rejects.toThrow(err);

            expect(Coordinate.prototype.save).toHaveBeenCalled();
        });
    });//addCoordinateService
    /* ************************************************** */

    //getAllCoordinates
    describe("Tests for getAllCoordinates", () => {
        //test 1
        test("Should successfully retrieve all saved coordinates", async () => {
            // Data mocking
            const mockCoordinates = [{
                id: "1",
                type: "Point",
                coordinates: [45.123, 7.123],
                name: "Test Coordinate 1",
            },
            {
                id: "2",
                type: "Area",
                coordinates: [[45.123, 7.123], [46.123, 8.123]],
                name: "Test Coordinate 2",
            }];

            //Support functions mocking
            jest.spyOn(Coordinate, "find").mockResolvedValue(mockCoordinates.map(coordinate => ({
                ...coordinate,
                toObject: () => coordinate
            })));

            //Call of getAllCoordinates
            const result = await getAllCoordinates();

            expect(Coordinate.find).toHaveBeenCalled(); 
            expect(result).toEqual(mockCoordinates);
        });

        //test 2
        test("Should throw an error if the connection with the DB fails", async () => {
            //Data mocking
            const err = new PositionError();
            
            //Support functions mocking
            (Coordinate.find as jest.Mock).mockImplementation(async () => err);
    
            //getCoordinateById
            await expect(getAllCoordinates()).rejects.toThrow(err);

            expect(Coordinate.find).toHaveBeenCalled();
        });
    });//getAllCoordinates
});//END OF COORDINATE SERVICES