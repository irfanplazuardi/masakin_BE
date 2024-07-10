/**
 * This module use for testing only, where i need this functionality to clean up the data
 */
import {
  Controller,
  Param,
  Get,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';

import { UsersService } from '../user.service';
import { AuthGuard } from '../../libs/guard/auth.guard';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('users')
@Controller('api/user')
export class UsersController {
  constructor(private userService: UsersService) {}
  @HttpCode(HttpStatus.OK)
  @Get()
  @ApiOperation({
    summary:
      'this end point for development only, so developer can see all user data register',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'use to see all user register',
    example: [
      {
        user_id: 'bc423413-2843-4dba-8a34-d79874496695',
        username: 'string',
        email: 'dewa@esample.com',
        password:
          '989657bc88a6a5dc.33e51abe653ee6c9f96eb9ca659da9f29609f1033b7bcd3c9a36965a000e52b3',
        created_at: '2024-07-09T00:00:50.156Z',
        updated_at: '2024-07-09T00:00:50.156Z',
      },
    ],
  })
  // @Serializer(UserDTO)
  @UseGuards(AuthGuard)
  @ApiUnauthorizedResponse({
    description: 'please use auth token',
  })
  getAllUser() {
    return this.userService.getAll();
  }

  @HttpCode(HttpStatus.OK)
  @ApiUnauthorizedResponse({
    description: 'please use auth token',
  })
  @ApiOperation({
    summary:
      'this end point for development only, so developer can see all user data register',
  })
  @Delete('/:id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'use to delete user from database',
    example: {
      message:
        'success delete user with id: 4648cfe0-989e-4bd5-989f-b8d048286699',
    },
  })
  @UseGuards(AuthGuard)
  @ApiUnauthorizedResponse({
    description: 'please use auth token',
  })
  async removeUser(@Param('id') user_id: string) {
    await this.userService.remove(user_id);
    return {
      message: `success delete user with id: ${user_id}`,
    };
  }
}
