import {
  Controller,
  Get,
  // Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RecipesService } from './recipes.service';
// import { CreateRecipeDto } from './dtos/create-recipe.dto';
import { UpdateRecipeDto } from './dtos/update-recipe.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/libs/guard/auth.guard';

@ApiBearerAuth()
@ApiTags('recipes')
@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  // @Post()
  // @UseGuards(AuthGuard)
  // create(@Body() createRecipeDto: CreateRecipeDto) {
  //   return this.recipesService.create(createRecipeDto);
  // }

  @Get()
  @UseGuards(AuthGuard)
  findAllRecipe() {
    return this.recipesService.findAllRecipe();
  }

  @Get('/recent')
  @UseGuards(AuthGuard)
  @ApiQuery({ name: 'category', required: false, type: String })
  findRecentRecipes(@Query('category') category?: string) {
    return this.recipesService.findRecentRecipes(category);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findRecipeByID(@Param('id') id: string) {
    return this.recipesService.findRecipeByID(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  updateRecipe(
    @Param('id') id: string,
    @Body() updateRecipeDto: UpdateRecipeDto,
  ) {
    return this.recipesService.updateRecipe(+id, updateRecipeDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  removeRecipe(@Param('id') id: string) {
    return this.recipesService.removeRecipe(+id);
  }
}
