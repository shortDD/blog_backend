import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import {
  DataSource,
  EntitySubscriberInterface,
  LoadEvent,
  Repository,
} from 'typeorm';
import { Blog } from './entities/blog.entity';

@Injectable()
export class BlogEntitySubscriber implements EntitySubscriberInterface<Blog> {
  constructor(
    @InjectDataSource() readonly connection: DataSource,
    @InjectRepository(Blog) private readonly blogRepository: Repository<Blog>,
  ) {}

  listenTo() {
    return Blog;
  }
  afterLoad(entity: Blog, event?: LoadEvent<Blog>): void | Promise<any> {
    console.log(entity);
  }
}
