import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { AuthUser } from 'src/authGurd/auth-user.decorator';
import { Roles } from 'src/authGurd/role.decorator';
import { User } from '../user/entities/user.entity';
import { CommentService, SubCommentService } from './comment.service';
import {
  CreateCommentInput,
  CreateSubCommentInput,
} from './dto/create-comment.dto';
import { SeeCommentsInput } from './dto/seeComments.dto';
import { SeeSubCommentsInput } from './dto/seeSubComments.dto';
import {
  EditCommentInput,
  EditSubCommentInput,
} from './dto/update-comment.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('create')
  @Roles('Client')
  create(
    @AuthUser() user: User,
    @Body() createCommentInput: CreateCommentInput,
  ) {
    return this.commentService.createComment(user, createCommentInput);
  }

  @Post('edit')
  @Roles('Client')
  edit(@AuthUser() user: User, @Body() editCommentInput: EditCommentInput) {
    return this.commentService.editComment(user, editCommentInput);
  }

  @Get('see')
  seeComments(@Query() seeCommentsInput: SeeCommentsInput) {
    return this.commentService.seeComments(seeCommentsInput);
  }

  @Delete('del/:id')
  @Roles('Client')
  delComment(@AuthUser() user: User, @Param('id') id: number) {
    return this.commentService.delComment(user, id);
  }
}
@Controller('sub-comment')
export class SubCommentController {
  constructor(private readonly subCommentService: SubCommentService) {}

  @Post('create')
  @Roles('Client')
  create(
    @AuthUser() user: User,
    @Body() createSubCommentInput: CreateSubCommentInput,
  ) {
    return this.subCommentService.createSubComment(user, createSubCommentInput);
  }

  @Post('edit')
  @Roles('Client')
  edit(
    @AuthUser() user: User,
    @Body() editSubCommentInput: EditSubCommentInput,
  ) {
    return this.subCommentService.editSubComment(user, editSubCommentInput);
  }

  @Delete('del/:id')
  @Roles('Client')
  delComment(@AuthUser() user: User, @Param('id') id: number) {
    return this.subCommentService.delSubComment(user, id);
  }

  @Get('see')
  seeSubComments(@Query() seeSubCommentsInput: SeeSubCommentsInput) {
    return this.subCommentService.seeSubComments(seeSubCommentsInput);
  }
}
