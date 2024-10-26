import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from '../interfaces/IUser';

interface UserDocument extends IUser, Document { }

const userSchema = new Schema<UserDocument>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

export default mongoose.model<UserDocument>('User', userSchema);