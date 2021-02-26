import mongoose from 'mongoose';
import { Password } from "../../../shared/utils/hash/Password";

/**
 * Whenever we are working with typescript and mongoose together
 * a good way to do this is write this 
 * 3 interfaces(UserAttrs, UserModel and UserDoc) on top of the file.
 * 
 * We do that in order to typescript do some validations when building a new object.
 */

/** 
 * An interface that describes the properties
 * that are required to create a new User.
 */
interface UserAttrs {
    email: string;
    password: string;
}

/**
 * An interface that describes the properties
 * that a User Model has.
 * 
 * An instance of Model is called Document.
 * 
 * The model is the way to interact with the database. 
 * When we are creating an object, with typescript 
 * we can validate the fields overwriting the build method
 * setting an custom interface to it.
 */
interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: UserAttrs): UserDoc;
}

/**
 * An interface that describes the properties that User Document has. 
 * Describes which properties the saved document has. 
 */
export interface UserDoc extends mongoose.Document {
    email: string;
    password: string;
}

const userSchema = new mongoose.Schema({
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        }
    },
    {
        toJSON:{
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
                delete ret.password;
                delete ret.__v;
            }
        }
    }
);

userSchema.pre('save', async function(done){
    const PASSWORD = 'password';
    if(this.isModified(PASSWORD)){
        const hashed = await Password.toHash(this.get(PASSWORD));
        this.set(PASSWORD, hashed);
    }

    done();
});

userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };