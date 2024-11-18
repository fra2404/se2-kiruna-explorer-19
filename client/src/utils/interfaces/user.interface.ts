export interface IUser {
  id: string;
  name: string;
  email: string;
  surname: string;
  phone?: string;
  role: UserRoleEnum;
}

export enum UserRoleEnum {
  Uplanner = 'PLANNER',
  Udeveloper = 'DEVELOPER',
  Visitor = 'VISITOR',
  Resident = 'RESIDENT',
}
