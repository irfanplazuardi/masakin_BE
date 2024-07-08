import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { Recipe } from './entities/recipe.entity';

@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(Recipe)
    private recipesRepository: Repository<Recipe>,
  ) {}

  create(createRecipeDto: CreateRecipeDto): Promise<Recipe> {
    const recipe = this.recipesRepository.create(createRecipeDto);
    return this.recipesRepository.save(recipe);
  }

  findAll(): Promise<Recipe[]> {
    return this.recipesRepository.find();
  }

  findOne(id: number): Promise<Recipe> {
    return this.recipesRepository.findOneBy({ id });
  }

  async update(id: number, updateRecipeDto: UpdateRecipeDto): Promise<Recipe> {
    await this.recipesRepository.update(id, updateRecipeDto);
    return this.recipesRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.recipesRepository.delete(id);
  }
}
