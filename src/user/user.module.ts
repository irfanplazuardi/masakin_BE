import { Module } from '@nestjs/common';
import { UsersService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { AuthController } from './controllers/auth.controller';
import { UsersController } from './controllers/users.controller';
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService],
  controllers: [AuthController, UsersController],
})
export class UserModule {}
