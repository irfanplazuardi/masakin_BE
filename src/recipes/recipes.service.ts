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
      const recipe = await queryRunner.manager.save(Recipe, {
        ...recipeDetails,
        user: { user_id: user_id },
      });

      recipe.ingredients = await Promise.all(
        ingredients.map(async (ingredient) => {
          let savedIngredient = await queryRunner.manager.findOne(Ingredient, {
            where: { name: ingredient.name },
          });
          if (!savedIngredient) {
            savedIngredient = await queryRunner.manager.save(Ingredient, {
              name: ingredient.name,
            });
          }
          const savedRecipeIngredient = await queryRunner.manager.save(
            RecipeIngredient,
            {
              recipe: { id: recipe.id },
              ingredient: savedIngredient,
              quantity: ingredient.quantity,
              measurement_unit: ingredient.measurement_unit,
            },
          );
          return savedRecipeIngredient;
        }),
      );

      recipe.equipments = await Promise.all(
        equipments.map(async (equipment) => {
          let savedEquipment = await queryRunner.manager.findOne(Equipment, {
            where: { name: equipment.name },
          });
          if (!savedEquipment) {
            savedEquipment = await queryRunner.manager.save(
              Equipment,
              equipment,
            );
          }
          return savedEquipment;
        }),
      );

      recipe.categories = await Promise.all(
        categories.map(async (category) => {
          let savedCategory = await queryRunner.manager.findOne(Category, {
            where: { name: category.name },
          });
          if (!savedCategory) {
            savedCategory = await queryRunner.manager.save(Category, category);
          }
          return savedCategory;
        }),
      );

      recipe.instructions = await Promise.all(
        instructions.map(async (instruction) => {
          const savedInstruction = await queryRunner.manager.save(
            RecipeInstruction,
            instruction,
          );
          return savedInstruction;
        }),
      );

      const data = await queryRunner.manager.save(Recipe, recipe);
      await queryRunner.commitTransaction();
      return data;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
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

  async findPopularRecipes(category?: string): Promise<Recipe[]> {
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
      order: { recipe_rating: 'DESC' },
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
