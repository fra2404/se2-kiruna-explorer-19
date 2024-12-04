import { body, param, ValidationChain } from 'express-validator';

export const validateCoordinate: ValidationChain[] = [
  body('type')
    .isString()
    .withMessage('Type must be a string')
    .isIn(['Point', 'Polygon'])
    .withMessage('Type must be either Point or Polygon'),
  body('coordinates').custom((value, { req }) => {
    if (req.body.type === 'Point') {
      if (
        !Array.isArray(value) ||
        value.length !== 2 ||
        !value.every(Number.isFinite)
      ) {
        throw new Error(
          'Coordinates for Point must be an array of two numbers [latitude, longitude]',
        );
      }
      const [latitude, longitude] = value;
      if (
        longitude < -180 ||
        longitude > 180 ||
        latitude < -90 ||
        latitude > 90
      ) {
        throw new Error(
          'Coordinates for Point must be valid longitude and latitude values',
        );
      }
    } else if (req.body.type === 'Polygon') {
      if (
        !Array.isArray(value) ||
        !value.every(
          (coord) =>
            Array.isArray(coord) &&
            coord.length === 2 &&
            coord.every(Number.isFinite),
        )
      ) {
        throw new Error(
          'Coordinates for Polygon must be an array of arrays of two numbers [[longitude, latitude], ...]',
        );
      }
      for (const [longitude, latitude] of value) {
        if (
          longitude < -180 ||
          longitude > 180 ||
          latitude < -90 ||
          latitude > 90
        ) {
          throw new Error(
            'Coordinates for Polygon must be valid longitude and latitude values',
          );
        }
      }
    } else {
      throw new Error('Invalid type');
    }
    return true;
  }),
  body('name')
    .isString()
    .withMessage('Name must be a string')
    .notEmpty()
    .withMessage('Name is required'),
];

export const validateId: ValidationChain[] = [
  param('id').isMongoId().withMessage('Invalid ID format'),
];
