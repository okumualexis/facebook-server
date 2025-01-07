import { User } from 'src/users/typeorm/user';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'posts' })
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column('text', { array: true, nullable: true })
  images: string[];

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.post)
  user: User;
}
