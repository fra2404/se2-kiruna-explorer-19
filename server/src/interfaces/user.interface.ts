import { UserRoleEnum } from '@utils/enums/user-role.enum';

export interface IUser {
  name: string;
  surname: string;
  email: string;
  password: string;
  phone?: string;
  role: UserRoleEnum;
}
