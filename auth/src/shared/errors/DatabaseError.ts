import AppError from "./AppError";
import ICommonErrorResponse, { ErrorType } from "./ICommonErrorResponse";

class DatabaseError extends AppError {
    statusCode = 500;
    private readonly messages: string[];
    private readonly status: ErrorType;

    constructor(message: string){
        super('Database error connection');
        // Only because we are extending a built in class
        Object.setPrototypeOf(this, DatabaseError.prototype);

        this.messages = [message];
        this.status = 'server.error';
    }

    serializedError(): ICommonErrorResponse {
        return {
            statusError: this.status,
            messages: this.messages
        }
    }
}

export default DatabaseError;