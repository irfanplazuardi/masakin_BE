import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { CreateRecipeDto } from './dtos/create-recipe.dto';
import { UpdateRecipeDto } from './dtos/update-recipe.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/libs/guard/auth.guard';

@ApiBearerAuth()
@ApiTags('recipes')
@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'to create new recipe' })
  @ApiResponse({
    status: 201,
    description: 'The recipe has been successfully created.',
  })
  createRecipe(@Body() recipeData: CreateRecipeDto, @Req() req) {
    const user_id: string = req.user.sub;
    return this.recipesService.createRecipe(recipeData, user_id);
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'to get all recipes' })
  findAllRecipe() {
    return this.recipesService.findAllRecipe();
  }

  @Get('/recent')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'to get all recipes in latest created order' })
  @ApiQuery({ name: 'category', required: false, type: String })
  findRecentRecipes(@Query('category') category?: string) {
    return this.recipesService.findRecentRecipes(category);
  }

  @Get('/popular')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'to get all recipes in highest rating order' })
  @ApiQuery({ name: 'category', required: false, type: String })
  findPopularRecipes(@Query('category') category?: string) {
    return this.recipesService.findPopularRecipes(category);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'to get recipe by id' })
  findRecipeByID(@Param('id') id: string) {
    return this.recipesService.findRecipeByID(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'to update recipe' })
  updateRecipe(
    @Param('id') id: string,
    @Body() updateRecipeDto: UpdateRecipeDto,
  ) {
    return this.recipesService.updateRecipe(+id, updateRecipeDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'to remove recipe' })
  removeRecipe(@Param('id') id: string) {
    return this.recipesService.removeRecipe(+id);
  }
}
