import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from './user/user.module';
import { User } from './user/user.entity';
import { RecipesModule } from './recipes/recipes.module';
import { Recipe } from './recipes/entities/recipe.entity';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: 'this is secret',
      signOptions: { expiresIn: '60s' },
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '0.0.0.0',
      port: 5432,
      username: 'postgres',
      password: '1234',
      database: 'masakin',
      entities: [User, Recipe],
      synchronize: true,
    }),
    UserModule,
    RecipesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
