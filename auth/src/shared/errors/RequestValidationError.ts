import { Result, ValidationError } from 'express-validator'
import AppError from './AppError';
import ICommonErrorResponse, { ErrorType } from './ICommonErrorResponse';

class RequestValidationError extends AppError{
    statusCode = 400;
    private readonly messages: string[];
    private readonly status: ErrorType;

    constructor(validations: Result<ValidationError>) {
        super('Invalid request parameters');

        // Only because we are extending a built in class
        Object.setPrototypeOf(this, RequestValidationError.prototype);

        this.messages = validations.array().map((validation): string => validation.msg);
        this.status = 'client.error';
    }

    serializedError(): ICommonErrorResponse {
        return {
            statusError: this.status,
            messages: this.messages
        }
    }
}

export default RequestValidationError;