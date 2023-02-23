import { CoreEntity } from 'src/entities/core.entity';
import { Blog } from 'src/modules/blog/entities/blog.entity';
import {
  Comment,
  SubComment,
} from 'src/modules/comment/entities/comment.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { Entity, ManyToOne, RelationId } from 'typeorm';
@Entity()
export class Like extends CoreEntity {
  @ManyToOne(() => Blog, (blog) => blog.likes, { nullable: true })
  blog?: Blog;

  @ManyToOne(() => Comment, (comment) => comment.likes, { nullable: true })
  comment?: Comment;

  @ManyToOne(() => SubComment, (subComment) => subComment.likes, {
    nullable: true,
  })
  subComment?: SubComment;

  @ManyToOne(() => User, (user) => user.likes)
  user: User;

  // @RelationId((like: Like) => like.blog)
  // blogId?: number;

  // @RelationId((like: Like) => like.comment)
  // commentId?: number;

  // @RelationId((like: Like) => like.subComment)
  // subCommentId?: number;

  // @RelationId((like: Like) => like.user)
  // userId?: number;
}
