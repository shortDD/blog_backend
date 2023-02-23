import { Module } from '@nestjs/common';
import { CommentService, SubCommentService } from './comment.service';
import { CommentController, SubCommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment, SubComment } from './entities/comment.entity';
import { Blog } from '../blog/entities/blog.entity';
import {
  CommentEntitySubscriber,
  SubCommentEntitySubscriber,
} from './comment-subscriber';
import { Like } from '../like/entities/like.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, SubComment, Blog, Like])],
  controllers: [CommentController, SubCommentController],
  providers: [
    CommentService,
    SubCommentService,
    CommentEntitySubscriber,
    SubCommentEntitySubscriber,
  ],
})
export class CommentModule {}
