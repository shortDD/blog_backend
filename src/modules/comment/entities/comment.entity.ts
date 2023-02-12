import { CoreEntity } from 'src/entities/core.entity';
import { Blog } from 'src/modules/blog/entities/blog.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';

@Entity()
export class Comment extends CoreEntity {
  @ManyToOne(() => User, (user) => user.comments)
  commenter: User;

  @RelationId((comment: Comment) => comment.commenter)
  commenterId: number;
  @ManyToOne(() => Blog, (blog) => blog.comments)
  blog: Blog;

  @RelationId((comment: Comment) => comment.blog)
  blogId: number;

  @Column()
  content: string;
}
