import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from './entities/blog.entity';
import { Read } from './entities/read.entity';
import { Tag } from './entities/tag.entity';
import { User } from '../user/entities/user.entity';
import { BlogEntitySubscriber } from './entity-subscriber';

@Module({
  imports: [TypeOrmModule.forFeature([Blog, Read, Tag, User])],
  controllers: [BlogController],
  providers: [BlogService, BlogEntitySubscriber],
})
export class BlogModule {}
