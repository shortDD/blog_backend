import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { auth } from 'src/utils/auth';
import {
  DataSource,
  EntitySubscriberInterface,
  LoadEvent,
  Repository,
} from 'typeorm';
import { Comment, SubComment } from '../comment/entities/comment.entity';
import { Like } from '../like/entities/like.entity';
import { Blog } from './entities/blog.entity';
import { Read } from './entities/read.entity';

@Injectable()
export class BlogEntitySubscriber implements EntitySubscriberInterface<Blog> {
  constructor(
    @InjectDataSource() readonly connection: DataSource,
    @InjectRepository(Like) private readonly likeRepository: Repository<Like>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Read)
    private readonly readRepository: Repository<Read>,
    private readonly jwtService: JwtService,
  ) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return Blog;
  }

  async afterLoad(blog: Blog, event?: LoadEvent<Blog>) {
    console.log(blog);
    const { id: blogId } = blog;
    const [comments, commentCount] = await this.commentRepository.findAndCount({
      where: { blog: { id: blogId } },
      relations: ['subComments'],
    });
    //计算总评论数
    let totalComments = commentCount;
    comments.forEach((comment) => {
      totalComments += comment.subComments.length;
    });
    blog.totalComments = totalComments;
    //计算阅读数
    const read = await this.readRepository.findOneBy({
      blog: { id: blogId },
    });
    blog.totalReads = read ? read.readNum : 0;
    //isMine
    await auth(this.jwtService, async (id) => {
      const like = await this.likeRepository.findOneBy({
        blog: { id: blogId },
        user: { id },
      });
      const count = await this.likeRepository.countBy({ blog: { id: blogId } });
      blog.isLike = Boolean(like);
      blog.isMine = blog.authorId === id;
      blog.totalLikes = count;
    });
  }
}
