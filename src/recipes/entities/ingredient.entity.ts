import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { RecipeIngredient } from './recipeIngredient.entity';

@Entity()
export class Ingredient {
  @PrimaryGeneratedColumn()
  ingredient_id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  image_url: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @OneToMany(
    () => RecipeIngredient,
    (recipeIngredient) => recipeIngredient.ingredient,
  )
  recipeIngredients: RecipeIngredient[];
}
