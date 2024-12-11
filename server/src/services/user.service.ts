import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../schemas/user.schema';
import { IUser } from '../interfaces/user.interface';
import { CustomError } from '@utils/customError';
import { IUserResponse } from '@interfaces/user.return.interface';
import { UserNotAuthorizedError } from '@utils/errors';

const secretKey = process.env.JWT_SECRET ?? 'your-secret-key';

export const getAllUsers = async (): Promise<IUserResponse[]> => {
  const users = await User.find();
  return users.map((user) => ({
    id: user.id.toString(),
    name: user.name,
    email: user.email,
    surname: user.surname,
    phone: user.phone,
    role: user.role,
  }));
};

export const createNewUser = async (
  userData: Partial<IUser>,
): Promise<string> => {
  const { name, email, password, surname, phone, role } = userData;

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  if (!password) {
    throw new CustomError('Password is required', 400);
  }
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    surname,
    phone,
    role,
  });

  await newUser.save();

  return 'User created successfully';
};

export const getUserById = async (
  id: string,
): Promise<IUserResponse | null> => {
  const user = await User.findById(id);
  if (!user) {
    return null;
  }

  const userResponse: IUserResponse = {
    id: user.id.toString(),
    name: user.name,
    email: user.email,
    surname: user.surname,
    phone: user.phone,
    role: user.role,
  };

  return userResponse;
};

export const loginUser = async (
  email: string,
  password: string,
): Promise<{ token: string }> => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new UserNotAuthorizedError();
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new UserNotAuthorizedError();
  }

  // Generate JWT
  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    secretKey,
    {
      expiresIn: '1h',
    },
  );

  return { token };
};

/* istanbul ignore next */
export const deleteUserByEmail = async (email: string): Promise<string> => {
  await User.findOneAndDelete({ email });
  return 'User deleted successfully';
};
