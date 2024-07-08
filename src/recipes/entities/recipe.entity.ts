import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

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
}
