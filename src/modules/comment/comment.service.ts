import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CoreOutput } from 'src/dto/core.dto';
import { Repository } from 'typeorm';
import { Blog } from '../blog/entities/blog.entity';
import { User } from '../user/entities/user.entity';
import {
  CreateCommentInput,
  CreateSubCommentInput,
} from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment, SubComment } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(SubComment)
    private readonly subCommentRepository: Repository<SubComment>,
    @InjectRepository(Blog)
    private readonly blogRepository: Repository<Blog>,
  ) {}
  async create(
    user: User,
    { blogId, content }: CreateCommentInput,
  ): Promise<CoreOutput> {
    try {
      const blog = await this.blogRepository.findOneBy({ id: blogId });
      if (!blog) {
        return {
          ok: false,
          error: '博客可能已被删除',
        };
      }
      await this.commentRepository.save(
        this.commentRepository.create({ blog, content, commenter: user }),
      );
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}

@Injectable()
export class SubCommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(SubComment)
    private readonly subCommentRepository: Repository<SubComment>,
  ) {}
  async create(
    user: User,
    { rootCommentId, parentCommentId, content }: CreateSubCommentInput,
  ): Promise<CoreOutput> {
    try {
      const rootComment = await this.commentRepository.findOneBy({
        id: rootCommentId,
      });
      if (!rootComment) {
        return {
          ok: false,
          error: '评论已被删除',
        };
      }
      if (parentCommentId) {
        const parentComment = await this.subCommentRepository.findOneBy({
          id: parentCommentId,
        });
        if (!parentComment) {
          return {
            ok: false,
            error: '评论已被删除',
          };
        }
        await this.subCommentRepository.save(
          this.subCommentRepository.create({
            subCommenter: user,
            rootComment,
            parentComment,
            content,
          }),
        );
      } else {
        await this.subCommentRepository.save(
          this.subCommentRepository.create({
            subCommenter: user,
            rootComment,
            content,
          }),
        );
      }
      return {
        ok: true,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
