import { addDocument } from "@controllers/document.controllers";
import { authenticateUser } from "@middlewares/auth.middleware";
import { authorizeRoles } from "@middlewares/role.middleware";
import { NextFunction, Request, Response } from "express";
import request from "supertest";
import express from "express";
import { documentRoutes } from "../routes/document.routes";

jest.mock('../controllers/document.controllers', () => ({
    addDocument: jest.fn(),
}));
jest.mock('../middlewares/auth.middleware');
jest.mock('../middlewares/role.middleware');

/* ******************************************* Suite n#1 - DOCUMENTS ******************************************* */
const app = express();
app.use(express.json());
app.use("/documents", documentRoutes);

describe("Tests for document route", () => {
    beforeEach(() => {
        (authenticateUser as jest.Mock).mockImplementation((req: Request, res: Response, next: NextFunction) => next());
        (authorizeRoles as jest.Mock).mockImplementation(() => (req: Request, res: Response, next: NextFunction) => next());
    });
    
    describe("Tests for /add", () => {
        test("Should add a new document", async () => {
            const newDocument = { id: '123', title: 'Test Document' };
            (addDocument as jest.Mock).mockImplementation((req, res) => {
                res.status(201).json({ success: true, data: newDocument });
            });

            const response = await request(app)
            .post('/documents/add')
            .send({
                title: 'Test Document',
                stakeholders: ['Stakeholder1', 'Stakeholder2'],
                scale: '1:1000',
                type: 'agreement',
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
    });
});