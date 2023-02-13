import { CoreEntity } from 'src/entities/core.entity';
import { Comment } from 'src/modules/comment/entities/comment.entity';
import { Tag } from 'src/modules/tag/entities/tag.entity';
import { User } from 'src/modules/user/entities/user.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  RelationId,
} from 'typeorm';

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

  @Column({ default: 0 })
  readNum: number;

  @OneToMany(() => Comment, (comment) => comment.blog)
  comments: [];
}
