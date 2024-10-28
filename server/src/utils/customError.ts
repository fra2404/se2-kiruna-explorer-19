export class CustomError extends Error {
    status: number;
    errors?: any[];

    constructor(message: string, status: number, errors?: any[]) {
        super(message);
        this.status = status;
        this.errors = errors;
        Object.setPrototypeOf(this, CustomError.prototype);
    }
}