import type { IResponse } from "@suku-kahanamoku/common-module/types";
import type { IAddress } from "./address.interface";

export interface IUser {
  _id?: string;
  email?: string;
  name?: string;
  surname?: string;
  givenName?: string;
  password?: string;
  tempPassword?: string;
  terms?: boolean;
  newsletter?: boolean;
  role?: "admin" | "user" | "guest";
  address?: {
    main?: IAddress;
    variants?: IAddress[];
  };
  phone?: string;
  createdAt?: Date;
  updatedAt?: Date;
  valid?: boolean;
}

export interface IUserResponse extends IResponse {
  data?: IUser;
}

export interface IUsersResponse extends IResponse {
  data?: IUser[];
}
