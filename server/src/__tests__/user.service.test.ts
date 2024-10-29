import { getUsers } from '@controllers/user.controllers';
import { IUserResponse } from '@interfaces/user.return.interface';
import { jest, describe, expect, beforeEach } from '@jest/globals'
import { Request, Response, NextFunction, json } from 'express';

//SERVICE TESTS
import { getAllUsers } from '../services/user.service';
import User from '../schemas/user.schema';

jest.mock("../schemas/user.schema");

//Suite for user services
describe("Tests for user services", () => {
    describe("Tests for getAllUsers", () => {
        //test 1
        test("Should return all users", async () => {
            //Mock of the datas thath User.find() should return
            const mockUsers = [
                {
                    id: "1",
                    name: "John",
                    email: "john@example.com",
                    surname: "Doe",
                    phone: "123456789",
                    role: "admin",
                },
                {
                    id: "2",
                    name: "Jane",
                    email: "jane@example.com",
                    surname: "Smith",
                    phone: "987654321",
                    role: "user",
                },
            ];

            //Mock of User.find
            const findMock = jest.spyOn(User, "find").mockResolvedValue(mockUsers as any);

            //Call of getAllUsers
            const result = await getAllUsers();

            //Checking result
            expect(result).toEqual([
                {
                    id: "1",
                    name: "John",
                    email: "john@example.com",
                    surname: "Doe",
                    phone: "123456789",
                    role: "admin",
                },
                {
                    id: "2",
                    name: "Jane",
                    email: "jane@example.com",
                    surname: "Smith",
                    phone: "987654321",
                    role: "user",
                },
            ]);

            expect(User.find).toHaveBeenCalledTimes(1);
            findMock.mockRestore();
        });
    });
});

//CONTROLLER TESTS

//ROUTE TESTS
