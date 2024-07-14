import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  ValidateNested,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';

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
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  image_url?: string;

  @IsOptional()
  @IsString()
  video_url?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsInt()
  difficulty: number;

  @IsInt()
  time_estimation: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IngredientDto)
  ingredients: IngredientDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EquipmentDto)
  equipments: EquipmentDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CategoryDto)
  categories: CategoryDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InstructionDto)
  instructions: InstructionDto[];
}
