import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Recipe } from './entities/recipe.entity';
import { Ingredient } from './entities/ingredient.entity';
import { Equipment } from './entities/equipment.entity';
import { Category } from './entities/category.entity';
import { RecipeInstruction } from './entities/recipe-instruction.entity';
import { RecipeIngredient } from './entities/recipe-ingredient.entity';
import { CreateRecipeDto } from './dtos/create-recipe.dto';

@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(Recipe)
    private recipeRepository: Repository<Recipe>,
    private dataSource: DataSource,
  ) {}

  async createRecipe(
    recipeData: CreateRecipeDto,
    user_id: string,
  ): Promise<Recipe> {
    const {
      ingredients,
      equipments,
      categories,
      instructions,
      ...recipeDetails
    } = recipeData;
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const savedRecipe = await queryRunner.manager.save(Recipe, {
        ...recipeDetails,
        user: { user_id: user_id },
      });
      for (const ingredient of ingredients) {
        const savedIngredient = await queryRunner.manager.save(Ingredient, {
          name: ingredient.name,
        });

        await queryRunner.manager.save(RecipeIngredient, {
          recipe: { id: savedRecipe.id },
          ingredient: { id: savedIngredient.id },
          quantity: ingredient.quantity,
          measurement_unit: ingredient.measurement_unit,
        });
      }

      savedRecipe.equipments = [];
      for (const equipment of equipments) {
        const savedEquipment = await queryRunner.manager.save(
          Equipment,
          equipment,
        );
        savedRecipe.equipments.push(savedEquipment);
      }

      savedRecipe.categories = [];
      for (const category of categories) {
        const savedCategory = await queryRunner.manager.save(
          Category,
          category,
        );
        savedRecipe.categories.push(savedCategory);
      }

      savedRecipe.instructions = [];
      for (const instruction of instructions) {
        console.log(instruction);

        const savedInstruction = await queryRunner.manager.save(
          RecipeInstruction,
          instruction,
        );

        savedRecipe.instructions.push(savedInstruction);
      }

      const data = await queryRunner.manager.save(Recipe, savedRecipe);
      await queryRunner.commitTransaction();
      return data;
    } catch (error) {
      // since we have errors lets rollback the changes we made
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }
  }

  async findAllRecipe(): Promise<Recipe[]> {
    return this.recipeRepository.find({
      relations: ['ingredients', 'equipments', 'categories', 'instructions'],
    });
  }

  async findRecentRecipes(category?: string): Promise<Recipe[]> {
    const whereCondition = {};

    if (category) {
      whereCondition['categories'] = { name: category };
    }

    return this.recipeRepository.find({
      select: {
        id: true,
        title: true,
        image_url: true,
        recipe_rating: true,
        time_estimation: true,
        created_at: true,
      },
      relations: {
        categories: true,
      },
      where: whereCondition,
      order: { created_at: 'DESC' },
      take: 10,
    });
  }

  async findRecipeByID(id: number): Promise<any> {
    const recipe = await this.recipeRepository.findOne({
      where: { id },
      relations: [
        'user',
        'ingredients.ingredient',
        'equipments',
        'categories',
        'instructions',
      ],
    });

    if (!recipe) {
      throw new NotFoundException(`Recipe with id ${id} not found`);
    }

    const { user, ...recipeData } = recipe;

    return {
      id: recipe.id,
      user_id: user?.user_id,
      ...recipeData,
      ingredients: recipe.ingredients.map((ingredient) => ({
        id: ingredient.ingredient.id,
        quantity: ingredient.quantity,
        measurement_unit: ingredient.measurement_unit,
        name: ingredient.ingredient.name,
        image_url: ingredient.ingredient.image_url,
        description: ingredient.ingredient.description,
      })),
    };
  }

  async updateRecipe(id: number, recipeData: any): Promise<Recipe> {
    await this.recipeRepository.update(id, recipeData);
    return this.findRecipeByID(id);
  }

  async removeRecipe(id: number): Promise<void> {
    await this.recipeRepository.delete(id);
  }
}
