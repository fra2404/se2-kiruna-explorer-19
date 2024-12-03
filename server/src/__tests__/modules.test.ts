import { Request, Response, NextFunction } from 'express';
import checkHeader from '../middlewares/checkHeader.middleware'; // Modifica il percorso in base alla tua struttura
import { jest } from '@jest/globals';

//Mock of the objs that will be used for the connection
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
});