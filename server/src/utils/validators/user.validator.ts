import { body } from 'express-validator';

export const validateUserSignUp = [
  body('email').isEmail().withMessage('Email is invalid'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('name').notEmpty().withMessage('Name is required'),
  body('surname').notEmpty().withMessage('Surname is required'),
  body('phone')
    .optional()
    .isMobilePhone('any')
    .withMessage('Phone number is invalid'),
  body('role')
    .isIn(['PLANNER', 'DEVELOPER', 'VISITOR', 'RESIDENT'])
    .withMessage('Role is invalid'),
];

export const validateUserLogin = [
  body('email').isEmail().withMessage('Email is invalid'),
  body('password').notEmpty().withMessage('Password is required'),
];
