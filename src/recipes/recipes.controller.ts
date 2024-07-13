import {
  Controller,
  Get,
  // Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { RecipesService } from './recipes.service';
// import { CreateRecipeDto } from './dtos/create-recipe.dto';
import { UpdateRecipeDto } from './dtos/update-recipe.dto';

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  // @Post()
  // create(@Body() createRecipeDto: CreateRecipeDto) {
  //   return this.recipesService.create(createRecipeDto);
  // }

  @Get()
  findAllRecipe() {
    return this.recipesService.findAllRecipe();
  }

  @Get('/recent')
  findRecentRecipes(@Query('category') category?: string) {
    return this.recipesService.findRecentRecipes(category);
  }

  @Get(':id')
  findRecipeByID(@Param('id') id: string) {
    return this.recipesService.findRecipeByID(+id);
  }

  @Patch(':id')
  updateRecipe(
    @Param('id') id: string,
    @Body() updateRecipeDto: UpdateRecipeDto,
  ) {
    return this.recipesService.updateRecipe(+id, updateRecipeDto);
  }

  @Delete(':id')
  removeRecipe(@Param('id') id: string) {
    return this.recipesService.removeRecipe(+id);
  }
}
