import { body } from 'express-validator';

export const validateUser = [
    body('email').isEmail().withMessage('Email is invalid'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('name').notEmpty().withMessage('Name is required'),
    body('surname').notEmpty().withMessage('Surname is required'),
    body('phone').isMobilePhone('any').withMessage('Phone number is invalid'),
    body('role').isIn(['TIZIO1', 'TIZIO2', 'TIZIO3']).withMessage('Role is invalid'),
];