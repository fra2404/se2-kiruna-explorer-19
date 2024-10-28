const BAD_CONNECTION = "The connection with the database failed"
const NOT_FOUND = "Document not found"
const NOT_AUTH = "The user is not authorized"
const NO_POSITION = "The given position doesn't exists"

class BadConnectionError extends Error {
    customMessage: string
    customeCode: number

    constructor() {
        super()
        this.customMessage = BAD_CONNECTION
        this.customeCode = 500
    }
}//BadConnectionError

class DocNotFoundError extends Error {
    customMessage: string
    customeCode: number

    constructor() {
        super()
        this.customMessage = NOT_FOUND
        this.customeCode = 404
    }
}//DocNotFoundError 

class UserNotAuthorizedError extends Error {
    customMessage: string
    customeCode: number

    constructor() {
        super()
        this.customMessage = NOT_AUTH
        this.customeCode = 403
    }
}//

class PositionError extends Error {
    customMessage: string
    customeCode: number

    constructor() {
        super()
        this.customMessage = NO_POSITION
        this.customeCode = 404
    }
}//PositionError

export { BadConnectionError, DocNotFoundError, UserNotAuthorizedError, PositionError  }