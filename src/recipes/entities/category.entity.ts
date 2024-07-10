import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Recipe } from './recipe.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  category_id: number;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToMany(() => Recipe, (recipe) => recipe.categories)
  recipes: Recipe[];
}
