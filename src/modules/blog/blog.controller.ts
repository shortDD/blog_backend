import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Delete,
  Req,
} from '@nestjs/common';
import { AuthUser } from 'src/authGurd/auth-user.decorator';
import { Roles } from 'src/authGurd/role.decorator';
import { User } from '../user/entities/user.entity';
import { BlogService } from './blog.service';
import { CreateBlogInput } from './dto/create-blog.dto';
import {
  SeeBlogsByKeywordsInput,
  SeeBlogsByTagInput,
} from './dto/see-blog.dto';
import { SeeFeedInput } from './dto/seeFeed.dto';
import { UpdateBlogInput } from './dto/update-blog.dto';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post('create')
  @Roles('Client')
  create(@AuthUser() user: User, @Body() createBlogInput: CreateBlogInput) {
    return this.blogService.createBlog(user, createBlogInput);
  }

  @Post('edit')
  @Roles('Client')
  editBlog(@AuthUser() user: User, @Body() updateBlogInput: UpdateBlogInput) {
    return this.blogService.editBlog(user, updateBlogInput);
  }
  @Get('detail/:id')
  blogDetail(@Param('id') id: number) {
    return this.blogService.seeBlogById(id);
  }
  @Get('tag/:id')
  blogByTag(@Query() sSeeBlogsByTagInput: SeeBlogsByTagInput) {
    return this.blogService.seeBlogsByTag(sSeeBlogsByTagInput);
  }
  @Get('search')
  blogByKeywords(@Query() seeBlogsByKeywordsInput: SeeBlogsByKeywordsInput) {
    return this.blogService.seeBlogsByKeywords(seeBlogsByKeywordsInput);
  }

  @Delete('del/:id')
  @Roles('Client')
  delBlog(@AuthUser() user: User, @Param('id') blogId: number) {
    return this.blogService.delBlog(user, blogId);
  }

  @Get('feed')
  seeFeed(@Query() seeFeedInput: SeeFeedInput) {
    return this.blogService.seeFeed(seeFeedInput);
  }
}
