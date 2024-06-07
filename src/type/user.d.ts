import { USER_ROLE, USER_SEX, USER_STATUS } from "@/constant/user";

export type UserQueryType = {
  name?: string;
  status?: number;
  current?: number;
  pageSize?: number;
}

export interface UserType {
  name: string;
  password: string;
  status: "on" | "off";
  nickName: string;
  _id?: string;
  sex: USER_SEX;
  role: USER_ROLE;
  status: USER_STATUS;
}