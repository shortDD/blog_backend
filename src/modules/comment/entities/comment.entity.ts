import { IsNotEmpty, Length } from 'class-validator';
import { CoreEntity } from 'src/entities/core.entity';
import { Blog } from 'src/modules/blog/entities/blog.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany, RelationId } from 'typeorm';

@Entity()
export class Comment extends CoreEntity {
  @ManyToOne(() => User, (user) => user.comments)
  commenter: User;

  @RelationId((comment: Comment) => comment.commenter)
  commenterId: number;

  @ManyToOne(() => Blog, (blog) => blog.comments, { onDelete: 'CASCADE' })
  blog: Blog;

  @RelationId((comment: Comment) => comment.blog)
  blogId: number;

  @OneToMany(() => SubComment, (subComment) => subComment.rootComment, {
    onDelete: 'SET NULL',
  })
  subComments?: SubComment[];

  @IsNotEmpty()
  @Column()
  @Length(5, 200)
  content: string;
}

@Entity()
export class SubComment extends CoreEntity {
  @ManyToOne(() => User, (user) => user.subComments)
  subCommenter: User;

  @RelationId((subComment: SubComment) => subComment.subCommenter)
  subCommenterId: number;

  @ManyToOne(() => Comment, (comment) => comment.subComments, {
    onDelete: 'CASCADE',
  })
  rootComment: Comment;

  @RelationId((subComment: SubComment) => subComment.rootComment)
  rootCommentId: number;

  @ManyToOne(() => SubComment, (subComment) => subComment.replys, {
    nullable: true,
  })
  parentComment?: SubComment;

  @RelationId((subComment: SubComment) => subComment.parentComment)
  parentCommentId: number;

  @OneToMany(() => SubComment, (subComment) => subComment.parentComment, {
    nullable: true,
  })
  replys?: SubComment[];

  @IsNotEmpty()
  @Column()
  @Length(5, 200)
  content: string;
}
