import AppError from "./AppError";
import ICommonErrorResponse, { ErrorType } from "./ICommonErrorResponse";

class InvalidJsonError extends AppError {
    statusCode = 400;
    private readonly messages: string[];
    private readonly status: ErrorType;
    
    constructor(message: string){
        super('Invalid json');

        Object.setPrototypeOf(this, InvalidJsonError.prototype);
        this.status = 'client.error';
        this.messages = [message];

    }

    serializedError(): ICommonErrorResponse {
        return {
            statusError: this.status,
            messages: this.messages
        }
    }
    
}

export default InvalidJsonError;