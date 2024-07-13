import {
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  IsInt,
  IsUUID,
  IsNotEmpty,
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
  @IsInt()
  category_id: number;
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

export class UpdateRecipeDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsUUID()
  user_id?: string;

  @IsOptional()
  @IsString()
  image_url?: string;

  @IsOptional()
  @IsString()
  video_url?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  difficulty?: number;

  @IsOptional()
  @IsInt()
  time_estimation?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IngredientDto)
  ingredients?: IngredientDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EquipmentDto)
  equipment?: EquipmentDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CategoryDto)
  categories?: CategoryDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InstructionDto)
  instructions?: InstructionDto[];
}
