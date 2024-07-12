import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { User } from '../../user/user.entity';
import { Recipe } from './recipe.entity';

@Entity()
export class RecipeRating {
  @PrimaryGeneratedColumn()
  rating_id: number;

  @ManyToOne(() => User, (user) => user.ratings)
  user: User;

  @ManyToOne(() => Recipe, (recipe) => recipe.ratings)
  recipe: Recipe;

  @Column()
  amount: number;
}
