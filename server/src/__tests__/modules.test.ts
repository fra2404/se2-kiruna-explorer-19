import { Request, Response, NextFunction } from 'express';
import { jest } from '@jest/globals';

import { IDocument } from '@interfaces/document.interface';
import checkHeader from '../middlewares/checkHeader.middleware';
import { errorHandler } from '../middlewares/errorHandler.middleware';
import documentSchema from '@schemas/document.schema';

import { CustomError } from '@utils/customError';

//Mock of the objs that will be used for the connection - for suite n#1
let req: Partial<Request>;
let res: Partial<Response>;
let next: NextFunction;

/* ******************************************* Suite n#1 - MIDDLEWARES ******************************************* */
describe('Test for the middlewares', () => {
    //checkHeader
    describe('Test for the checkHeader middleware', () => {
        afterEach(() => {
            jest.clearAllMocks();
        });

        beforeEach(() => {
            req = {
                headers: {}
            } as unknown as Request;

            res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            } as unknown as Response;

            next = jest.fn();
        });

        //test 1
        test('Should return 400 if the api-key is missing', () => {
            //Mock of the api-key passed to the request
            (req.headers as Record<string, string | undefined>)['x-api-key'] = undefined;
            
            //Call of checkHeader
            checkHeader(req as Request, res as Response, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Missing x-api-key header' });
            expect(next).not.toHaveBeenCalled();
        });

        //test 2
        test('Should return 403 if the api-key is incorrect', () => {
            //Mock of the api-key passed to the request
            (req.headers as Record<string, string | undefined>)['x-api-key'] = "wrong-api-key";

            //Call of checkHeader
            checkHeader(req as Request, res as Response, next);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ error: 'Forbidden: Invalid header value' });
            expect(next).not.toHaveBeenCalled();
        });

        //test 3
        test('should call next function if x-api-key is correct', () => {
            //Mock of the api-key passed to the request
            (req.headers as Record<string, string | undefined>)['x-api-key'] = "my-api-key";

            //Call of checkHeader
            checkHeader(req as Request, res as Response, next);

            expect(next).toHaveBeenCalled();
        });
    }); //checkHeader
    /* ************************************************** */

    //errorHandler
    describe('Test for the errorHandler middleware', () => {
        afterEach(() => {
            jest.clearAllMocks();
        });

        beforeEach(() => {
            req = {} as unknown as Request;

            res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            } as unknown as Response;

            next = jest.fn();
        });

        //test 1
        test('Should set 400 as the status of the response if a CustomError is triggered', () => {
            //Data mock
            const err = new CustomError('Test error', 400, ["Invalid input"]);
            
            //Call of errorHandler
            errorHandler(err, req as Request, res as Response, next);
        
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Test error',
                errors: ['Invalid input']
            });
            expect(next).not.toHaveBeenCalled();
          });
        
          //test 2
          it('Should set 500 as the status of the response if an Error is triggered', () => {
            //Data mock
            const err = new Error();
        
            //Call of errorHandler
            errorHandler(err as CustomError, req as Request, res as Response, next);
        
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: "Internal Server Error",
                errors: []
            });
            expect(next).not.toHaveBeenCalled();
          });
    }); //errorHandler
});