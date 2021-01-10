import { User, UserDoc } from '../models/User';
import { Password } from "../../../shared/utils/hash/Password";
import jwt from 'jsonwebtoken';
import { WrongCredentialsProvidedError } from '@bcmtickets/common';

interface IRequest {
    email: string;
    password: string;
}

interface IResponse {
    user: UserDoc;
    session: SessionObject;
}

export interface SessionObject {
    jwt: string;
}

export const execute = async ({email, password}: IRequest): Promise<IResponse> => {
    const existingUser = await User.findOne({email});
    const isRightPassword = existingUser && await Password.compare(existingUser.password, password);

    if(!existingUser || !isRightPassword){
        throw new WrongCredentialsProvidedError('Invalid credentials');
    }

    const aJwt = jwt.sign({
        id: existingUser.id,
        email
    }, process.env.JWT_KEY!);

    return { user: existingUser, session: { jwt: aJwt } };
}