import { Model } from "mongoose";

// Define and export TUserRole
export type TUserRole =  "user" | "admin" | "superAdmin";
export type TUserStatus = 'in-progress' | 'blocked';

export interface IRefreshToken {
  token: string;
  createdAt: Date;
  isRevoked: boolean;
}

export interface IUser{
    name: string;
    email: string;
    password: string;
    role: TUserRole;
    status: TUserStatus;
    isDeleted: boolean;
    refreshTokens?: IRefreshToken[];
}

export type UserModel = Model<IUser>;

