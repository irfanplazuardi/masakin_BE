import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
  ManyToOne,
} from 'typeorm';
import { User } from 'src/user/user.entity';
import { RecipeIngredient } from './recipe-ingredient.entity';
import { Equipment } from './equipment.entity';
import { Category } from './category.entity';
import { RecipeInstruction } from './recipe-instruction.entity';
import { RecipeRating } from './recipe-rating.entity';

@Entity()
export class Recipe {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.recipes)
  user: User;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 255 })
  image_url: string;

  @Column({ type: 'varchar', length: 255 })
  video_url: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: 3 })
  difficulty: number; // 1: easy, 2: normal, 3: challenging

  @Column({ type: 'int' })
  time_estimation: number; // Time in minutes

  @Column({ default: 5, type: 'decimal', precision: 3, scale: 1 })
  recipe_rating: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @OneToMany(
    () => RecipeIngredient,
    (RecipeIngredient) => RecipeIngredient.recipe,
  )
  ingredient: RecipeIngredient[];

  @ManyToMany(() => Equipment, (equipment) => equipment.recipes)
  @JoinTable({
    name: 'recipe_equipment',
    joinColumn: { name: 'recipeId', referencedColumnName: 'id' },
    inverseJoinColumn: {
      name: 'equipmentId',
      referencedColumnName: 'equipment_id',
    },
  })
  equipment: Equipment[];

  @ManyToMany(() => Category, (category) => category.recipes)
  @JoinTable({
    name: 'recipe_categories',
    joinColumn: { name: 'recipeId', referencedColumnName: 'id' },
    inverseJoinColumn: {
      name: 'categoryId',
      referencedColumnName: 'category_id',
    },
  })
  categories: Category[];

  @OneToMany(() => RecipeInstruction, (instruction) => instruction.recipe)
  instructions: RecipeInstruction[];

  @OneToMany(() => RecipeRating, (rating) => rating.recipe)
  ratings: RecipeRating[];
}
