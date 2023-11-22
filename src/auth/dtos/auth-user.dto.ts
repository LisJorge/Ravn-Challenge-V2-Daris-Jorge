import { Role } from "@prisma/client";

export interface AuthUserDto {
  email: string;
  password: string;
  role: Role;
  userId: number;
}