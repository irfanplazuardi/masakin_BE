import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { RecipeIngredient } from './recipeIngredient.entity';
import { Equipment } from './equipment.entity';
import { Category } from './category.entity';
import { Instruction } from './instruction.entity';
import { Rating } from './rating.entity';

@Entity()
export class Recipe {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 255 })
  image_url: string;

  @Column({ type: 'varchar', length: 255 })
  video_url: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'int', default: 3 })
  difficulty: number; // 1: easy, 2: normal, 3: challenging

  @Column({ type: 'int' })
  time_estimation: number; // Time in minutes

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
    (recipeIngredient) => recipeIngredient.recipe,
  )
  recipeIngredients: RecipeIngredient[];

  @ManyToMany(() => Equipment, (equipment) => equipment.recipes)
  @JoinTable({
    name: 'recipe_equipment',
    joinColumn: { name: 'id', referencedColumnName: 'id' },
    inverseJoinColumn: {
      name: 'equipment_id',
      referencedColumnName: 'equipment_id',
    },
  })
  equipment: Equipment[];

  @ManyToMany(() => Category, (category) => category.recipes)
  @JoinTable({
    name: 'recipe_categories',
    joinColumn: { name: 'id', referencedColumnName: 'id' },
    inverseJoinColumn: {
      name: 'category_id',
      referencedColumnName: 'category_id',
    },
  })
  categories: Category[];

  @OneToMany(() => Instruction, (instruction) => instruction.recipe)
  instructions: Instruction[];

  @OneToMany(() => Rating, (rating) => rating.recipe)
  rating: Rating[];
}
