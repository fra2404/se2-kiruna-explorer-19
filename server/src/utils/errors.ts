import { CustomError } from '@utils/customError';

const BAD_CONNECTION = 'The connection with the database failed';
const NOT_FOUND = 'Document not found';
const NOT_AUTH = 'The user is not authorized';
const NO_POSITION = "The given position doesn't exist";

class BadConnectionError extends CustomError {
  constructor(errors?: any[]) {
    super(BAD_CONNECTION, 500, errors);
  }
}

class DocNotFoundError extends CustomError {
  constructor(errors?: any[]) {
    super(NOT_FOUND, 404, errors);
  }
}

class UserNotAuthorizedError extends CustomError {
  constructor(errors?: any[]) {
    super(NOT_AUTH, 403, errors);
  }
}

class PositionError extends CustomError {
  constructor(errors?: any[]) {
    super(NO_POSITION, 404, errors);
  }
}

export {
  BadConnectionError,
  DocNotFoundError,
  UserNotAuthorizedError,
  PositionError,
};
