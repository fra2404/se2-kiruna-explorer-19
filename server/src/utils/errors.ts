import { CustomError } from '@utils/customError';

const BAD_CONNECTION = 'The connection with the database failed';
const NOT_FOUND = 'Document not found';
const NOT_AUTH = 'The user is not authorized';
const NO_POSITION = "The given position doesn't exist";
const MEDIA_NOT_FOUND = 'Media not found';
const STAKEHOLDER_NOT_FOUND = 'Stakeholder not found';
const DOCUMENTTYPE_NOT_FOUND = 'Document Type not found';

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

class MediaNotFoundError extends CustomError {
  constructor(errors?: any[]) {
    super(MEDIA_NOT_FOUND, 404, errors);
  }
}

class StakeholderNotFoundError extends CustomError {
  constructor(errors?: any[]) {
    super(STAKEHOLDER_NOT_FOUND, 404, errors);
  }
}


class DocumentTypeNotFoundError extends CustomError {
  constructor(errors?: any[]) {
    super(DOCUMENTTYPE_NOT_FOUND, 404, errors);
  }
}

export {
  BadConnectionError,
  DocNotFoundError,
  UserNotAuthorizedError,
  PositionError,
  MediaNotFoundError,
  StakeholderNotFoundError,
  DocumentTypeNotFoundError
};
