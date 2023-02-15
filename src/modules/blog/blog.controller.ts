import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { AuthUser } from 'src/authGurd/auth-user.decorator';
import { Roles } from 'src/authGurd/role.decorator';
import { User } from '../user/entities/user.entity';
import { BlogService } from './blog.service';
import { CreateBlogInput } from './dto/create-blog.dto';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post('create')
  @Roles('Client')
  create(@AuthUser() user: User, @Body() createBlogInput: CreateBlogInput) {
    return this.blogService.createBlog(user, createBlogInput);
  }

  @Get('detail/:id')
  blogDetail(@Param('id') id: number) {
    return this.blogService.seeBlogById(id);
  }
  @Get('tag/:id')
  blogByTag(@Param('id') tagId: number) {
    return this.blogService.seeBlogByTag(tagId);
  }
  @Get('search')
  blogByKeywords(@Query('keywords') keywords: string) {
    return this.blogService.seeBlogByKeywords(keywords);
  }
}
