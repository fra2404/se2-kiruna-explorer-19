import { jest, describe, expect, beforeEach, it } from '@jest/globals'
import { Request, Response, NextFunction } from 'express';

//service -> controller -> route


import { getUsers } from '../src/controllers/user.controllers';
import { getAllUsers } from '../src/services/user.service';
import { IUserResponse } from '../src/interfaces/user.return.interface';
import { IUser } from '../src/interfaces/user.interface';

jest.mock('./path/to/userService');

describe('getUsers', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        req = {};
        res = {
            //response mock check
            json: jest.fn(),
        };
        //errors mock check
        next = jest.fn();
    });

    it('should return all users', async () => {
        const mockUsers: IUserResponse[] = [
            { name: 'Francesco', surname: 'Albano', password: 'example1', email: 'example1@mail.com', phone: undefined, role: 'visitor' },
            { name: 'Sergio', surname: 'Cicero', password: 'example2', email: 'example2@mail.com', phone: undefined, role: 'resident' },
        ];

        (getAllUsers as jest.Mock).mockResolvedValue(mockUsers);

        await getUsers(req as Request, res as Response, next);

        expect(res.json).toHaveBeenCalledWith(mockUsers);
        expect(next).not.toHaveBeenCalled();
    });

    it('should return an error', async () => {
        const error = new Error('Connection error');
        (getAllUsers as jest.Mock).mockRejectedValue(error);

        await getUsers(req as Request, res as Response, next);

        expect(res.json).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalledWith(error);
    });
});

