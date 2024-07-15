import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  ValidateNested,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class IngredientDto {
  @IsOptional()
  @IsInt()
  ingredient_id?: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsInt()
  @IsNotEmpty()
  quantity: number;

  @IsString()
  @IsNotEmpty()
  measurement_unit: string;
}

class EquipmentDto {
  @IsOptional()
  @IsInt()
  equipment_id?: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;
}

class CategoryDto {
  @IsOptional()
  @IsInt()
  category_id?: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;
}

class InstructionDto {
  @IsInt()
  step_number: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsString()
  image_url_1?: string;

  @IsOptional()
  @IsString()
  image_url_2?: string;
}

export class CreateRecipeDto {
  @ApiProperty({ example: 'Nasi Goreng' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'https://example.com/nasigoreng.jpg' })
  @IsOptional()
  @IsString()
  image_url?: string;

  @ApiProperty({ example: 'https://example.com/nasigoreng.mp4' })
  @IsOptional()
  @IsString()
  video_url?: string;

  @ApiProperty({
    example: 'A popular Indonesian fried rice with a blend of spices.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 2 })
  @IsInt()
  difficulty: number;

  @ApiProperty({ example: 30 })
  @IsInt()
  time_estimation: number;

  @ApiProperty({
    example: [
      { name: 'cooked rice', quantity: 4, measurement_unit: 'cups' },
      { name: 'sweet soy sauce', quantity: 2, measurement_unit: 'tablespoons' },
      { name: 'vegetable oil', quantity: 2, measurement_unit: 'tablespoons' },
      { name: 'egg', quantity: 1, measurement_unit: 'piece' },
      { name: 'green onions', quantity: 2, measurement_unit: 'stalks' },
      { name: 'salt', quantity: 1, measurement_unit: 'teaspoon' },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IngredientDto)
  ingredients: IngredientDto[];

  @ApiProperty({
    example: [
      { name: 'wok' },
      { name: 'cutting board' },
      { name: 'knife' },
      { name: 'spatula' },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EquipmentDto)
  equipments: EquipmentDto[];

  @ApiProperty({ example: [{ name: 'indonesian' }, { name: 'savory' }] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CategoryDto)
  categories: CategoryDto[];

  @ApiProperty({
    example: [
      {
        step_number: 1,
        description:
          'Heat vegetable oil in a wok over medium heat. Add chopped shallots, garlic, and red chili, and sauté until fragrant.',
      },
      {
        step_number: 2,
        description:
          'Add diced chicken breast and cook until it is no longer pink.',
      },
      {
        step_number: 3,
        description:
          'Push the chicken to one side of the wok and scramble the egg on the other side until cooked.',
      },
      {
        step_number: 4,
        description: 'Mix everything together and add the cooked rice.',
      },
      {
        step_number: 5,
        description:
          'Stir in sweet soy sauce, soy sauce, salt, and black pepper. Cook until the rice is heated through.',
      },
      {
        step_number: 6,
        description: 'Add chopped green onions and mix well. Serve hot.',
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InstructionDto)
  instructions: InstructionDto[];
}
