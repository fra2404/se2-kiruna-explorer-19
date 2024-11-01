import { addDocument } from "@controllers/document.controllers";
import { addingDocument } from "@services/document.service";
import { Request, Response, NextFunction } from "express";

jest.mock('../services/document.service');

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