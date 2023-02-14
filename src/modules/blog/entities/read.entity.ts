import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Blog } from './blog.entity';

@Entity()
export class Read {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 0 })
  readNum: number;

  @OneToOne(() => Blog, (blog) => blog.read)
  @JoinColumn()
  blog: Blog;
}
