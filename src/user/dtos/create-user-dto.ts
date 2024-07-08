import { IsEmail, IsString } from 'class-validator';

export class CreateUserDTO {
  @IsEmail()
  email: string;
  @IsEmail()
  username: string;
  @IsString()
  password: string;
}
