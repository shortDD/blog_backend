import { CoreEntity } from 'src/entities/core.entity';
import { Comment } from 'src/modules/comment/entities/comment.entity';
import { Tag } from 'src/modules/tag/entities/tag.entity';
import { User } from 'src/modules/user/entities/user.entity';
import {
  AfterLoad,
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  RelationId,
} from 'typeorm';
import { Read } from './read.entity';

@Entity()
export class Blog extends CoreEntity {
  @Column()
  title: string;

  @Column({ nullable: true })
  cover?: string;

  @ManyToOne(() => User, (user) => user.blogs)
  author: User;

  @RelationId((blog: Blog) => blog.author)
  authorId: number;

  @Column({ length: 5000 })
  content: string;

  @ManyToMany(() => Tag, (tag) => tag.blogs)
  tags: Tag[];

  @OneToMany(() => Comment, (comment) => comment.blog)
  comments: [];

  @OneToOne(() => Read, (read) => read.blog)
  read: Read;

  totalComments: number;
}
