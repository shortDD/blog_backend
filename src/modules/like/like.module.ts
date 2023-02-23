import { Module } from '@nestjs/common';
import { LikeService } from './like.service';
import { LikeController } from './like.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from './entities/like.entity';
import { Blog } from '../blog/entities/blog.entity';
import { User } from '../user/entities/user.entity';
import { Comment, SubComment } from '../comment/entities/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Like, Blog, User, Comment, SubComment])],
  controllers: [LikeController],
  providers: [LikeService],
})
export class LikeModule {}
