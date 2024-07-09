import {
  Controller,
  Post,
  Body,
  NotFoundException,
  HttpCode,
  HttpStatus,
  ConflictException,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiConflictResponse,
} from '@nestjs/swagger';

import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../user.service';

import { CreateUserDTO } from '../dtos/create-user-dto';
import { AuthUserDTO } from '../dtos/auth-user-dto';
import { UserDTO } from '../dtos/user';

import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
const scrypt = promisify(_scrypt);

import { Serializer } from '../../libs/interceptors/serialize.interceptor';
@Controller('api/auth')
export class AuthController {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}
  @HttpCode(HttpStatus.CREATED)
  @Post('/sign-up')
  @ApiOperation({ summary: 'sign up or create account to the application  ' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The found record',
    type: UserDTO,
  })
  @ApiConflictResponse()
  @Serializer(UserDTO)
  async userSignUp(@Body() createUser: CreateUserDTO) {
    const salt = randomBytes(8).toString('hex');
    const has = (await scrypt(createUser.password, salt, 32)) as Buffer;
    const hasPassword = salt + '.' + has.toString('hex');
    try {
      const user = await this.userService.create(
        createUser.email,
        createUser.username,
        hasPassword,
      );
      return user;
    } catch (error) {
      throw new ConflictException('username or email already used');
    }
  }
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'sign in to application with email and password' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The found record',
    example: {
      access_token: 'some token use to access protection rout',
    },
  })
  @Post('/log-in')
  async signInUser(@Body() authUser: AuthUserDTO) {
    const user = await this.userService.find(authUser.email);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    const access_token = await this.jwtService.signAsync({
      sub: user.user_id,
      username: user.username,
    });
    return {
      access_token,
    };
  }
}
