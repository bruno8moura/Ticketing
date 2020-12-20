import AppError from "./AppError";
import ICommonErrorResponse from "./ICommonErrorResponse";

class NotAuthorizedError extends AppError {
    statusCode = 401;
    
    constructor(){
        super('Not authorized.');

        Object.setPrototypeOf(this, NotAuthorizedError.prototype);
    }

    serializedError(): ICommonErrorResponse {
        return {
            statusError: 'client.error',
            messages: ['Not authorized']
        }
    }    
}

export default NotAuthorizedError;