import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Recipe } from './recipe.entity';

@Entity()
export class Equipment {
  @PrimaryGeneratedColumn()
  equipment_id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  image_url: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToMany(() => Recipe, (recipe) => recipe.equipments)
  recipes: Recipe[];
}
