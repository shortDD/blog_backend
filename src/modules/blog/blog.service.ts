import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBlogInput } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Blog } from './entities/blog.entity';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog) private readonly blogRepository: Repository<Blog>,
  ) {}
  createBlog(createBlogInput: CreateBlogInput) {
    return this.blogRepository.findOne({
      where: { id: 1 },
      relations: ['read'],
    });
  }
}
