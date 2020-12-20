import AppError from "./AppError";
import ICommonErrorResponse, { ErrorType } from "./ICommonErrorResponse";

class WrongCredentialsProvidedError extends AppError {
    statusCode = 400;
    private readonly messages: string[];
    private readonly status: ErrorType;

    constructor(message: string){
        super('Wrong credentials provided.');
        // Only because we are extending a built in class
        Object.setPrototypeOf(this, WrongCredentialsProvidedError.prototype);

        this.messages = [message];
        this.status = 'client.error';
    }

    serializedError(): ICommonErrorResponse {
        return {
            statusError: this.status,
            messages: this.messages
        }
    }
}

export default WrongCredentialsProvidedError;