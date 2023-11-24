import { Role } from "@prisma/client";
import { Exclude, Expose } from "class-transformer";

@Exclude()
export class CurrentUserDto {
  @Expose({ name: 'sub'})
  userId: number;

  @Expose()
  role: Role;
}