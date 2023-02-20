import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import {
  DataSource,
  EntitySubscriberInterface,
  InsertEvent,
  LoadEvent,
  Repository,
} from 'typeorm';
import { Comment, SubComment } from '../comment/entities/comment.entity';
import { Blog } from './entities/blog.entity';

@Injectable()
export class BlogEntitySubscriber implements EntitySubscriberInterface<Blog> {
  constructor(
    @InjectDataSource() readonly connection: DataSource,
    @InjectRepository(Blog) private readonly blogRepository: Repository<Blog>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(SubComment)
    private readonly subCommentRepository: Repository<SubComment>,
  ) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return Blog;
  }
  // afterLoad(entity: Blog, event?: LoadEvent<Blog>): void | Promise<any> {
  //   console.log(entity);
  // }
  // async beforeInsert(event: InsertEvent<Blog>) {
  //   const { id: blogId } = event.entity;
  //   const commentCount = await this.commentRepository.countBy({ blogId });
  //   console.log(commentCount);
  // }
  async afterLoad(entity: Blog, event?: LoadEvent<Blog>) {
    const { id } = entity;
    const [comments, commentCount] = await this.commentRepository.findAndCount({
      where: { blog: { id } },
      relations: ['subComments'],
    });
    let totalComments = commentCount;
    comments.forEach((comment) => {
      totalComments += comment.subComments.length;
    });
    entity.totalComments = totalComments;
  }
}
