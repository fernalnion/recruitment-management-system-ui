import { IRole } from './Role';
import { IDepartment } from './department';

export interface IUserBase {
  username: string;
  password: string;
  email: string;
  mobile: string;
  firstname: string;
  lastname?: string;
  dob?: Date;
}

export interface IUseAdd extends IUserBase {
  department: string;
  role: string;
}

export interface IUser extends IUserBase {
  _id: string;
  department: IDepartment;
  role: IRole;
  isActive?: boolean;
  isVerified?: boolean;
}
