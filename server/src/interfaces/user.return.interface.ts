import { UserRoleEnum } from '@utils/enums/user-role.enum';

export interface IUserResponse {
  id: string;
  name: string;
  email: string;
  surname: string;
  phone?: string;
  role: UserRoleEnum;
}
