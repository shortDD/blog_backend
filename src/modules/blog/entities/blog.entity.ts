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
import { Like } from 'src/modules/like/entities/like.entity';
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

  @Column({ nullable: true })
  // @Length(10, 666)
  foreword?: string;

  @Column({ length: 5000, nullable: true })
  // @Length(20, 5000)
  html?: string;

  @Column()
  // 0：草稿 1 发布待审核 2审核通过 3审核失败
  status: 0 | 1 | 2 | 3;
  @ManyToMany(() => Tag, (tag) => tag.blogs, { eager: true, nullable: true })
  @JoinTable()
  tags?: Tag[];

  @OneToMany(() => Comment, (comment) => comment.blog, { nullable: true })
  comments?: Comment[];

  @OneToOne(() => Read, (read) => read.blog)
  read: Read;

  @OneToMany(() => Like, (like) => like.blog)
  likes: Like[];

  isLike: boolean = false;

  isMine: boolean = false;

  totalComments: number = 0;

  totalReads: number = 0;

  totalLikes: number = 0;

  totalMarks: number = 0;
}
