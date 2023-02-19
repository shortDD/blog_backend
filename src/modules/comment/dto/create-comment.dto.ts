import { PickType } from '@nestjs/mapped-types';
import { Comment, SubComment } from '../entities/comment.entity';
export class CreateCommentInput extends PickType(Comment, [
  'blogId',
  'content',
]) {}

export class CreateSubCommentInput extends PickType(SubComment, [
  'content',
  'rootCommentId',
  'parentCommentId',
]) {}
