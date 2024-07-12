import { Module } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { RecipesController } from './recipes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recipe } from './entities/recipe.entity';
import { Ingredient } from './entities/ingredient.entity';
import { Equipment } from './entities/equipment.entity';
import { Category } from './entities/category.entity';
import { RecipeInstruction } from './entities/recipe-instruction.entity';
import { RecipeRating } from './entities/recipe-rating.entity';
import { RecipeIngredient } from './entities/recipe-ingredient.entity';
import { User } from 'src/user/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Recipe,
      Ingredient,
      Equipment,
      Category,
      RecipeInstruction,
      RecipeRating,
      RecipeIngredient,
      User,
    ]),
  ],
  controllers: [RecipesController],
  providers: [RecipesService],
})
export class RecipesModule {}
