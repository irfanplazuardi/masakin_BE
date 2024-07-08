import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from './user/user.module';

import { User } from './user/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'devuser',
      password: 'password123',
      database: 'masakinDB',
      entities: [User],
      synchronize: true,
    }),

    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
