import {
  Controller,
  Post,
  Body,
  NotFoundException,
  HttpCode,
  HttpStatus,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';

import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
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
@ApiTags('auth')
@Controller('api/auth')
export class AuthController {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}
  @HttpCode(HttpStatus.CREATED)
  @Post('/sign-up')
  @ApiOperation({ summary: 'sign up or create account to the application' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The found record',
    type: UserDTO,
    example: {
      user_id: 'e08d47f9-cf58-4b42-98ee-b94d89ef3988',
      email: 'test4@gmail.com',
      username: 'test4',
    },
  })
  @ApiConflictResponse({
    example: {
      message: 'username or email already used',
      error: 'Conflict',
      statusCode: HttpStatus.CONFLICT,
    },
  })
  @Serializer(UserDTO)
  async userSignUp(@Body() createUser: CreateUserDTO) {
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(createUser.password, salt, 32)) as Buffer;
    const hashPassword = salt + '.' + hash.toString('hex');
    try {
      const user = await this.userService.create(
        createUser.email,
        createUser.username,
        hashPassword,
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
  @ApiNotFoundResponse({
    description: 'user not found',
    example: {
      message: 'user not found',
      error: 'Not Found',
      statusCode: HttpStatus.NOT_FOUND,
    },
  })
  @ApiBadRequestResponse({
    description: "password doesn't match",
    example: {
      message: "password doesn't match",
      error: 'Bad Request',
      statusCode: HttpStatus.BAD_REQUEST,
    },
  })
  @Post('/log-in')
  async signInUser(@Body() authUser: AuthUserDTO) {
    const user = await this.userService.find(authUser.email);
    if (!user) {
      throw new NotFoundException('user not found');
    }

    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(authUser.password, salt, 32)) as Buffer;
    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException("password doesn't match");
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
