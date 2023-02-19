import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthUser } from 'src/authGurd/auth-user.decorator';
import { Roles } from 'src/authGurd/role.decorator';
import { User } from '../user/entities/user.entity';
import { CommentService, SubCommentService } from './comment.service';
import {
  CreateCommentInput,
  CreateSubCommentInput,
} from './dto/create-comment.dto';
import { EditCommentInput } from './dto/update-comment.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('create')
  @Roles('Client')
  create(
    @AuthUser() user: User,
    @Body() createCommentInput: CreateCommentInput,
  ) {
    return this.commentService.create(user, createCommentInput);
  }

  @Post('edit')
  @Roles('Client')
  edit(@AuthUser() user: User, @Body() editCommentInput: EditCommentInput) {
    return this.commentService.editComment(user, editCommentInput);
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
    return this.subCommentService.create(user, createSubCommentInput);
  }
}
