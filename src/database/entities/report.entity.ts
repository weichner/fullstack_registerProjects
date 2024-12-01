import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Project } from './project.entity';

@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  weekNumber: number;

  @Column('decimal', { precision: 5, scale: 2 })
  dedicationPercentage: number;

  @ManyToOne(() => User, (user) => user.reports)
  user: User;

  @ManyToOne(() => Project, (project) => project.reports)
  project: Project;
}
