import { AppError, ICommonErrorResponse, ErrorType } from "@bcmtickets/common";

export class TicketAlreadyCreatedError extends AppError {
    statusCode = 400;
    private readonly messages: string[];
    private readonly status: ErrorType;

    constructor(message: string){
        super('Ticket already created.');
        // Only because we are extending a built in class
        Object.setPrototypeOf(this, TicketAlreadyCreatedError.prototype);

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
