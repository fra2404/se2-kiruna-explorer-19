import { jest, describe, expect } from '@jest/globals'
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import User from '../schemas/user.schema';
import Document from '../schemas/document.schema';
import { IUser } from '../interfaces/user.interface';
import { IDocument } from '@interfaces/document.interface'; 
import { UserRoleEnum } from "@utils/enums/user-role.enum";
import { DocTypeEnum } from "@utils/enums/doc-type.enum";
import { getAllUsers, createNewUser, getUserById, loginUser } from '../services/user.service';
import { addingDocument, getAllDocuments, getDocumentById } from '../services/document.service';

import { CustomError } from '@utils/customError';
import { BadConnectionError, DocNotFoundError } from "../utils/errors";

jest.mock("../schemas/user.schema");
jest.mock("../schemas/document.schema");
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

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
                { expiresIn: '1h' }
            ); 
        });

        //test 2
        test("Should return an error when the password isn't matched", async () => {
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
            const choosenPassMock = "wrong-password";
    
            //Support functions mocking
            (User.findOne as jest.Mock).mockImplementation(async () => mockUser);
            (bcrypt.compare as jest.Mock).mockImplementation(async () => false);
    
            await expect(loginUser(choosenEmailMock, choosenPassMock)).rejects.toThrow(CustomError);
            await expect(loginUser(choosenEmailMock, choosenPassMock)).rejects.toThrow('Invalid email or password');
        });
    });//loginUser
});//END OF USER SERVICES

/* ******************************************* Suite n#2 - DOCUMENTS ******************************************* */
describe("Tests for user services", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    
    //addingDocument
    describe("Tests for addingDocument", () => {
        //test 1
        test("Should successfully add a new document", async () => {
            //Data mocking
            const mockDocumentData: IDocument = {
                title: "Test title",
                stakeholders: "Test corp",
                scale: "Test value",
                type: DocTypeEnum.Agreement,
                date: "01-01-2000",
                summary: "Test summary"
            };

            //Support functions mocking
            (Document.prototype.save as jest.Mock).mockImplementation(async () => undefined);

            //Call of addingDocument
            await expect(addingDocument(mockDocumentData)).resolves.toBeUndefined();

            expect(Document).toHaveBeenCalledWith(mockDocumentData);
            expect(Document.prototype.save).toHaveBeenCalled();
        });

        //test 2
        test("Should return an error", async () => {
            //Data mocking
            const mockDocumentData: IDocument = {
                title: "",
                stakeholders: "",
                scale: "",
                type: DocTypeEnum.Agreement,
                date: "",
                summary: ""
            };
            
            //Support functions mocking
            (Document.prototype.save as jest.Mock).mockImplementation(async () => {
                throw new CustomError("An error occurred while saving the document", 500);
            });

            //Call of addingDocument
            await expect(addingDocument(mockDocumentData)).rejects.toThrow(new BadConnectionError());

            expect(Document).toHaveBeenCalledWith(mockDocumentData);
            expect(Document.prototype.save).toHaveBeenCalled();
        });
    });//addingDocument
    /* ************************************************** */

    //getAllDocuments
    describe("Tests for getAllDocuments", () => {
        //test 1
        test("Should successfully retrieve all documents", async () => {
            //Data mocking
            const mockDocuments = [
                { 
                    title: "Test title 1", 
                    stakeholders: "Company A", 
                    scale: "Test value 1", 
                    type: DocTypeEnum.Agreement, 
                    date: "01-01-2000", 
                    summary: "Test summary 1" },
                { 
                    title: "Test title 2", 
                    stakeholders: "Company B", 
                    scale: "Test value 2", 
                    type: DocTypeEnum.Competition, 
                    date: "02-01-2000", 
                    summary: "Test summary 2" 
                }
            ];

            //Support functions mocking
            (Document.find as jest.Mock).mockImplementation(async() => mockDocuments);

            //Call of getAllDocuments
            const result = await getAllDocuments();

            expect(result).toEqual(mockDocuments);
            expect(Document.find).toHaveBeenCalledTimes(1);
        });

        //test 2
        test("Should return an error", async () => {
            //Support functions mocking
            (Document.find as jest.Mock).mockImplementation(async () => {
                throw new CustomError("An error occurred while retrieving the documents", 500);
            });

            //Call of getAllDocuments
            await expect(getAllDocuments()).rejects.toThrow(new DocNotFoundError());

            expect(Document.find).toHaveBeenCalledTimes(1);
        });
    });//getAllDocuments
    /* ************************************************** */

    //getDocumentById
    describe("Tests for getDocumentById", () => {
        //test 1
        test("Should successfully retrieve a specific document", async () => {
            //Data mocking
            const docID = "1";

            const mockDocument = { 
                id: docID,
                title: "Test title 1", 
                stakeholders: "Company A", 
                scale: "Test value 1", 
                type: DocTypeEnum.Agreement, 
                date: "01-01-2000", 
                summary: "Test summary 1" 
            };

            //Support functions mocking
            (Document.findById as jest.Mock).mockImplementation(async() => mockDocument);

            //Call of getAllDocuments
            const result = await getDocumentById(docID);

            expect(result).toEqual(mockDocument);
            expect(Document.findById).toHaveBeenCalledWith(docID);
            expect(Document.findById).toHaveBeenCalledTimes(1);
        });

        //test 2
        test("Should return an error", async () => {
            //Support functions mocking
            (Document.findById as jest.Mock).mockImplementation(async () => {
                throw new CustomError("An error occurred while retrieving the document", 500);
            });

            //Call of getAllDocuments
            //"100" is a random non-existing document id
            await expect(getDocumentById("100")).rejects.toThrow(new DocNotFoundError());

            expect(Document.findById).toHaveBeenCalledWith("100");
            expect(Document.findById).toHaveBeenCalledTimes(1);
        });
    });//getDocumentById
});//END OF CONTROLLER SERVICES