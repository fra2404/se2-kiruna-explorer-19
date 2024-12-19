import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from '@interfaces/user.interface';
import { UserRoleEnum } from '@utils/enums/user-role.enum';

export type UserDocument = IUser & Document;

const userSchema = new Schema<UserDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      required: true,
      enum: UserRoleEnum,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<UserDocument>('User', userSchema);
