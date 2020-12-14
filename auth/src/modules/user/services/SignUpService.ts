import UserAlreadyExistsError from '../../../shared/errors/UserAlreadyExistsError';
import { User, UserDoc } from '../models/User';

interface IRequest {
    email: string;
    password: string;
}

interface IResponse {
    successful: boolean;
    message: string;
}

const signUpService = async ({email, password}: IRequest): Promise<UserDoc> => {
    const existingUser = await User.findOne({email});

    if(existingUser){
        throw new UserAlreadyExistsError('User already exists.');
    }

    const user = User.build({ email, password });
    const createdUser = await user.save();
    
    return createdUser;
}

export default signUpService;