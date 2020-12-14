import AppError from "./AppError";
import ICommonErrorResponse, { ErrorType } from "./ICommonErrorResponse";

class UserAlreadyExistsError extends AppError {
    statusCode = 400;
    private readonly messages: string[];
    private readonly status: ErrorType;

    constructor(message: string){
        super('User already exist.');
        // Only because we are extending a built in class
        Object.setPrototypeOf(this, UserAlreadyExistsError.prototype);

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

export default UserAlreadyExistsError;