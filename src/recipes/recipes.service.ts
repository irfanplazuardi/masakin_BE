import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recipe } from './entities/recipe.entity';
import { Ingredient } from './entities/ingredient.entity';
import { Equipment } from './entities/equipment.entity';
import { Category } from './entities/category.entity';
import { RecipeInstruction } from './entities/recipe-instruction.entity';
import { RecipeRating } from './entities/recipe-rating.entity';
import { RecipeIngredient } from './entities/recipe-ingredient.entity';
import { User } from 'src/user/user.entity';

@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(Recipe)
    private recipeRepository: Repository<Recipe>,
    @InjectRepository(Ingredient)
    private ingredientRepository: Repository<Ingredient>,
    @InjectRepository(Equipment)
    private equipmentRepository: Repository<Equipment>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(RecipeInstruction)
    private instructionRepository: Repository<RecipeInstruction>,
    @InjectRepository(RecipeRating)
    private ratingRepository: Repository<RecipeRating>,
    @InjectRepository(RecipeIngredient)
    private recipeIngredientRepository: Repository<RecipeIngredient>,
    @InjectRepository(User)
    private userRepository: Repository<RecipeIngredient>,
  ) {}

  async findAllRecipe(): Promise<Recipe[]> {
    return this.recipeRepository.find({
      relations: [
        'ingredient',
        'equipment',
        'categories',
        'instructions',
        'ratings',
      ],
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
        'ingredient.ingredient',
        'equipment',
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
      ingredient: recipe.ingredient.map((ingredient) => ({
        id: ingredient.ingredient.id,
        quantity: ingredient.quantity,
        measurement_unit: ingredient.measurement_unit,
        name: ingredient.ingredient.name,
        image_url: ingredient.ingredient.image_url,
        description: ingredient.ingredient.description,
      })),
    };
  }

  // async create(recipeData: any): Promise<Recipe> {
  //   const {
  //     ingredients,
  //     equipment,
  //     categories,
  //     instructions,
  //     user_id,
  //     ...recipeDetails
  //   } = recipeData;

  //   const recipe = new Recipe();
  //   Object.assign(recipe, recipeDetails);
  //   recipe.user = await this.userRepository.findOne(user_id);

  //   // Handle ingredients
  //   recipe.recipeIngredients = [];
  //   for (const ingredientData of ingredients) {
  //     let ingredient: Ingredient;
  //     if (ingredientData.ingredient_id) {
  //       ingredient = await this.ingredientRepository.findOne(
  //         ingredientData.ingredient_id,
  //       );
  //     } else {
  //       ingredient = new Ingredient();
  //       ingredient.name = ingredientData.name;
  //       await this.ingredientRepository.save(ingredient);
  //     }
  //     const recipeIngredient = new RecipeIngredient();
  //     recipeIngredient.ingredient = ingredient;
  //     recipeIngredient.quantity = ingredientData.quantity;
  //     recipeIngredient.measurement_unit = ingredientData.measurement_unit;
  //     recipe.recipeIngredients.push(recipeIngredient);
  //   }

  //   // Handle equipment
  //   recipe.equipment = [];
  //   for (const equipmentData of equipment) {
  //     let equipmentEntity: Equipment;
  //     if (equipmentData.equipment_id) {
  //       equipmentEntity = await this.equipmentRepository.findOne(
  //         equipmentData.equipment_id,
  //       );
  //     } else {
  //       equipmentEntity = new Equipment();
  //       equipmentEntity.name = equipmentData.name;
  //       await this.equipmentRepository.save(equipmentEntity);
  //     }
  //     recipe.equipment.push(equipmentEntity);
  //   }

  //   // Handle categories
  //   recipe.categories = [];
  //   for (const categoryData of categories) {
  //     const category = await this.categoryRepository.findOne(
  //       categoryData.category_id,
  //     );
  //     recipe.categories.push(category);
  //   }

  //   // Handle instructions
  //   recipe.instructions = [];
  //   for (const instructionData of instructions) {
  //     const instruction = new Instruction();
  //     Object.assign(instruction, instructionData);
  //     instruction.recipe = recipe;
  //     recipe.instructions.push(instruction);
  //   }

  //   return this.recipeRepository.save(recipe);
  // }

  async updateRecipe(id: number, recipeData: any): Promise<Recipe> {
    await this.recipeRepository.update(id, recipeData);
    return this.findRecipeByID(id);
  }

  async removeRecipe(id: number): Promise<void> {
    await this.recipeRepository.delete(id);
  }
}
