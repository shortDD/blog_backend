import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { auth } from 'src/utils/auth';
import {
  DataSource,
  EntitySubscriberInterface,
  LoadEvent,
  RemoveEvent,
  Repository,
} from 'typeorm';
import { Like } from '../like/entities/like.entity';
import { Comment, SubComment } from './entities/comment.entity';

@Injectable()
export class CommentEntitySubscriber
  implements EntitySubscriberInterface<Comment>
{
  constructor(
    private readonly jwtService: JwtService,
    @InjectDataSource() readonly connection: DataSource,

    @InjectRepository(Like) private readonly likeRepository: Repository<Like>,
  ) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return Comment;
  }
  async afterLoad(comment: Comment, event?: LoadEvent<Comment>) {
    const { id: commentId } = comment;
    await auth(this.jwtService, async (id) => {
      const like = await this.likeRepository.findOneBy({
        comment: { id: commentId },
        user: { id },
      });
      const count = await this.likeRepository.countBy({
        comment: { id: commentId },
      });
      comment.isLike = Boolean(like);
      comment.isMine = comment.commenterId === id;
      comment.totalLikes = count;
    });
  }
}
@Injectable()
export class SubCommentEntitySubscriber
  implements EntitySubscriberInterface<SubComment>
{
  constructor(
    private readonly jwtService: JwtService,
    @InjectDataSource() readonly connection: DataSource,

    @InjectRepository(Like) private readonly likeRepository: Repository<Like>,
  ) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return SubComment;
  }

  async afterLoad(subComment: SubComment, event?: LoadEvent<SubComment>) {
    const { id: subCommentId } = subComment;
    await auth(this.jwtService, async (id) => {
      const like = await this.likeRepository.findOneBy({
        subComment: { id: subCommentId },
        user: { id },
      });
      const count = await this.likeRepository.countBy({
        subComment: { id: subCommentId },
      });
      subComment.isLike = Boolean(like);
      subComment.isMine = subComment.subCommenterId === id;
      subComment.totalLikes = count;
    });
  }
}
