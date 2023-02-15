import { PartialType } from '@nestjs/mapped-types';
import { CreateBlogInput } from './create-blog.dto';

export class UpdateBlogDto extends PartialType(CreateBlogInput) {}
