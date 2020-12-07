export type ErrorType = 'client.error' | 'server.error';

export default interface ICommonErrorResponse {
    statusError: ErrorType;
    messages: string[];    
}