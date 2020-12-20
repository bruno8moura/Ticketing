import AppError from './AppError';
import ICommonErrorResponse, { ErrorType } from './ICommonErrorResponse';

class JwtSecretNotDefinedError extends AppError{
    statusCode = 500;
    private readonly messages: string[];
    private readonly status: ErrorType;

    constructor() {
        super('JWT Secret not defined. Env variable "JWT_KEY" not found.');

        // Only because we are extending a built in class
        Object.setPrototypeOf(this, JwtSecretNotDefinedError.prototype);

        this.messages = ['A secret must be provide in order to create a JWT.'];
        this.status = 'server.error';
    }

    serializedError(): ICommonErrorResponse {
        return {
            statusError: this.status,
            messages: this.messages
        }
    }
}

export default JwtSecretNotDefinedError;