import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class CreateUserDTO {
  @ApiProperty({
    example: '<email>@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({})
  @IsString()
  password: string;

  @ApiProperty({})
  @IsString()
  username: string;
}
