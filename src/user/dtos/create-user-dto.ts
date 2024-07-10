import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class CreateUserDTO {
  @ApiProperty({
    example: '<email>@Example.com',
  })
  @IsEmail()
  email: string;
  @ApiProperty({
    example: 'Password!123',
  })
  @IsString()
  password: string;

  @ApiProperty({})
  @IsString()
  username: string;
}
