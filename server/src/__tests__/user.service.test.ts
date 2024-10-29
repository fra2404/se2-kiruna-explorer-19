import { getUsers } from '@controllers/user.controllers';
import { IUserResponse } from '@interfaces/user.return.interface';
import { jest, describe, expect, beforeEach, it } from '@jest/globals'
import { Request, Response, NextFunction, json } from 'express';

//service -> controller -> route


jest.mock('@services/user.service');

describe('getUsers', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        req = {};
        res = {
            //response mock check
            json: jest.fn() as unknown as (data: any) => Response,
        };
        //errors mock check
        next = jest.fn();
    });

    it('should return all users', async () => {
        const mockUsers: IUserResponse[] = [
            { id: '1', name: 'Francesco', surname: 'Albano', email: 'example1@mail.com', phone: '+393271540653', role: 'visitor' },
            { id: '2', name: 'Sergio', surname: 'Cicero', email: 'example2@mail.com', phone: '+393271540653', role: 'resident' },
        ];

        await getUsers(req as Request, res as Response, next);

        expect(res.json).toHaveBeenCalledWith(mockUsers);
        expect(next).not.toHaveBeenCalled();
    });

    it('should return an error', async () => {
        const error = new Error('Connection error');

        await getUsers(req as Request, res as Response, next);

        expect(res.json).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalledWith(error);
    });
});

