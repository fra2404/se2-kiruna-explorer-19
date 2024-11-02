import express, { NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";
import { documentRoutes } from "../routes/document.routes";
import { addDocument, getDocuments } from "@controllers/document.controllers";
import request from "supertest";
import { authenticateUser } from "@middlewares/auth.middleware";
import { authorizeRoles } from "@middlewares/role.middleware";

jest.mock('../controllers/document.controllers');
jest.mock('../controllers/document.controllers');
jest.mock('../middlewares/auth.middleware');
jest.mock('../middlewares/role.middleware');

/* ******************************************* Suite n#1 - DOCUMENTS ******************************************* */
//TODO: the tests return the following error: Route.post() requires a callback function but got a [object Undefined]. I think that is a problem of validateAddDocument, but I have not found a solution

const app = express();
app.use(bodyParser.json());
app.use("/api/documents", documentRoutes);

afterEach(() => {
    jest.clearAllMocks();
})

describe("Tests for document route", () => {
    
    describe("Tests for /add", () => {
        test("Should add a new document", async () => {
            const newDocument = { id: '123', title: 'Test Document' };
            (addDocument as jest.Mock).mockImplementation((_req, res) => {
                res.status(201).json({ success: true, data: newDocument });
            });
            (authenticateUser as jest.Mock).mockImplementation((req, res, next) => {
                next();
            });
            (authorizeRoles as jest.Mock).mockImplementation((req, res, next) => {
                next();
            });

            const response = await request(app)
            .post('/api/documents/add')
            .send({
                title: 'Test Document',
                stakeholders: ['Stakeholder1', 'Stakeholder2'],
                scale: '1:1000',
                type: 'AGREEMENT',
                connections: ['Document1', 'Document2'],
                language: 'EN',
                media: ['Media1', 'Media2'],
                coordinates: [10, 20],
                summary: 'Test summary',
            });

            expect(response.status).toBe(201);
            expect(response.body).toEqual({
                success: true,
                data: newDocument,
            });
            expect(addDocument).toHaveBeenCalled();
        });

        test("Should return an error (title missing)", async () => {
            const newDocument = { id: '123', title: 'Test Document' };
            (addDocument as jest.Mock).mockImplementation((_req, res) => {
                res.status(201).json({ success: true, data: newDocument });
            });
            (authenticateUser as jest.Mock).mockImplementation((req, res, next) => {
                next();
            });
            (authorizeRoles as jest.Mock).mockImplementation((req, res, next) => {
                next();
            })

            const response = await request(app)
            .post('/api/documents/add')
            .send({
                title: '',
                stakeholders: ['Stakeholder1', 'Stakeholder2'],
                scale: '1:1000',
                type: 'AGREEEMENT',
                connections: ['Document1', 'Document2'],
                language: 'EN',
                media: ['Media1', 'Media2'],
                coordinates: [10, 20],
                summary: 'Test summary',
            });

            expect(response.status).toBe(400);
        });

        test("Should return an error (wrong document type)", async () => {
            const newDocument = { id: '123', title: 'Test Document' };
            (addDocument as jest.Mock).mockImplementation((_req, res) => {
                res.status(201).json({ success: true, data: newDocument });
            });
            (authenticateUser as jest.Mock).mockImplementation((req, res, next) => {
                next();
            });
            (authorizeRoles as jest.Mock).mockImplementation((req, res, next) => {
                next();
            })

            const response = await request(app)
            .post('/api/documents/add')
            .send({
                title: 'Test Document',
                stakeholders: ['Stakeholder1', 'Stakeholder2'],
                scale: '1:1000',
                type: 'asdsafsd',
                connections: ['Document1', 'Document2'],
                language: 'EN',
                media: ['Media1', 'Media2'],
                coordinates: [10, 20],
                summary: 'Test summary',
            });

            expect(response.status).toBe(400);
        });
    });

    describe("Tests for /get", () => {
        test("Should get all documents", async () => {
            const response = await request(app)
            .get('/api/documents');

            expect(response.status).toBe(201);
            expect(getDocuments).toHaveBeenCalled();
        });
    });

    describe("Tests for /get by id", () => {
        //TODO
    });
});