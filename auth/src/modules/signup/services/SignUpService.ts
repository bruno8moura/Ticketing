import DatabaseError from "../../../shared/errors/DatabaseError";

interface IRequest {
    email: string;
    password: string;
}

const signUpService = ({email, password}: IRequest) => {
    throw new DatabaseError('Cannot connect to database');
}

export default signUpService;