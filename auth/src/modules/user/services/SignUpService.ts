import { UserAlreadyExistsError } from '@bcmtickets/common';
import { User, UserDoc } from '../models/User';
import { SessionObject, execute as signin  } from './SignInService';

interface IRequest {
    email: string;
    password: string;
}

interface IResponse {
    user: UserDoc;
    session: SessionObject;
}

export const execute = async ({email, password}: IRequest): Promise<IResponse> => {
    const existingUser = await User.findOne({email});

    if(existingUser){
        throw new UserAlreadyExistsError('User already exists.');
    }

    const createdUser = User.build({ email, password });
    await createdUser.save();

    const { user, session } = await signin({email,password});
    
    return { user, session };
}