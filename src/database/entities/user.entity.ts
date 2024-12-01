import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Report } from './report.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: 'user' }) // roles: 'admin user' or 'operational user'
  role: string;

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];
}
