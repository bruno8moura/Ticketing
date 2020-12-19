import { Request } from 'express';
import jwt, { JsonWebTokenError } from 'jsonwebtoken';
import { uuid } from 'uuidv4';
import JwtSecretNotDefinedError from '../../errors/JwtSecretNotDefinedError';

interface IUsefulInformation {
    id: string | undefined;
    email: string;
    secretKey: string;
}

export const setJwtInSession = ({email, id, secretKey}: IUsefulInformation, request: Request) => {

    const aJwt = jwt.sign({
        id: id || uuid(),
        email
    }, secretKey);

    request.session = {
        jwt: aJwt
    }
}