import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Recipe } from './recipe.entity';

@Entity()
export class RecipeInstruction {
  @PrimaryGeneratedColumn()
  instruction_id: number;

  @ManyToOne(() => Recipe, (recipe) => recipe.instructions)
  recipe: Recipe;

  @Column()
  step_number: number;

  @Column({ type: 'text' })
  description: string;

  @Column({ nullable: true })
  image_url_1: string;

  @Column({ nullable: true })
  image_url_2: string;
}
