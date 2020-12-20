import UserAlreadyExistsError from '../../../shared/errors/UserAlreadyExistsError';
import { User, UserDoc } from '../models/User';

interface IRequest {
    email: string;
    password: string;
}

export const execute = async ({email, password}: IRequest): Promise<UserDoc> => {
    const existingUser = await User.findOne({email});

    if(existingUser){
        throw new UserAlreadyExistsError('User already exists.');
    }

    const user = User.build({ email, password });
    await user.save();
    
    return user;
}