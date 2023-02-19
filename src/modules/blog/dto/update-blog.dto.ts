import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty } from 'class-validator';
import { CreateBlogInput } from './create-blog.dto';

export class UpdateBlogInput {
  @IsNotEmpty({ message: '博客Id不能为空' })
  blogId: number;

  data: updateBlogData;
}

class updateBlogData extends PartialType(CreateBlogInput) {}
