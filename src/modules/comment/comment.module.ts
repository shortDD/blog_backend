import { Module } from '@nestjs/common';
import { CommentService, SubCommentService } from './comment.service';
import { CommentController, SubCommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment, SubComment } from './entities/comment.entity';
import { Blog } from '../blog/entities/blog.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, SubComment, Blog])],
  controllers: [CommentController, SubCommentController],
  providers: [CommentService, SubCommentService],
})
export class CommentModule {}
