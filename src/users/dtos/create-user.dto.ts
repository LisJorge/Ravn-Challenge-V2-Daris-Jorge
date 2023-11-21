import { Role } from "@prisma/client";

export class CreateUserDto{
  name: string;
  lastname: string;
  email: string;
  password: string;
  role: Role;
}