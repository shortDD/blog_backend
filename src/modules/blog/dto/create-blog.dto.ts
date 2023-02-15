import { PickType } from '@nestjs/mapped-types';
import { CoreOutput } from 'src/dto/core.dto';
import { Blog } from '../entities/blog.entity';
import { IsNotEmptyObject } from 'class-validator';
export class CreateBlogInput extends PickType(Blog, [
  'title',
  'foreword',
  'cover',
  'html',
]) {
  // @IsNotEmptyObject({ nullable: false }, { message: '标签不能为空' })
  tags: string[];
}

export class CreateBlogOutput extends CoreOutput {
  blog?: Blog;
}
