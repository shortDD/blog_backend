import { CoreEntity } from 'src/entities/core.entity';
import {
  Comment,
  SubComment,
} from 'src/modules/comment/entities/comment.entity';
import { Tag } from 'src/modules/blog/entities/tag.entity';
import { User } from 'src/modules/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  RelationId,
} from 'typeorm';
import { Read } from './read.entity';
import { Length } from 'class-validator';
@Entity()
export class Blog extends CoreEntity {
  @Column()
  title: string;

  @Column({ nullable: true })
  cover?: string;

  @ManyToOne(() => User, (user) => user.blogs, { eager: true })
  @JoinTable()
  author: User;

  @RelationId((blog: Blog) => blog.author)
  authorId: number;

  @Column({ length: 666 })
  @Length(10, 666)
  foreword: string;

  @Column({ length: 5000 })
  @Length(20, 5000)
  html: string;

  @ManyToMany(() => Tag, (tag) => tag.blogs, { eager: true })
  @JoinTable()
  tags: Tag[];

  @OneToMany(() => Comment, (comment) => comment.blog, { nullable: true })
  comments?: Comment[];

  @OneToOne(() => Read, (read) => read.blog)
  read: Read;

  totalComments: number;
}
