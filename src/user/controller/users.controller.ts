/**
 * This module use for testing only, where i need this functionality to clean up the data
 */
import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Query,
  Delete,
  Put,
  NotFoundException,
  Session,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';

import { UsersService } from '../user.service';
import { Serializer } from '../../libs/interceptors/serialize.interceptor';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserDTO } from '../dtos/user';

@ApiBearerAuth()
@ApiTags('users')
@Controller('api/user')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Delete('/:id')
  async removeUser(@Param('id') user_id: string) {
    await this.userService.remove(user_id);
    return {
      message: `success delete user with id: ${user_id}`,
    };
  }
}
