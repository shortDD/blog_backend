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
import { SeeCommentsInput, SeeCommentsOutput } from './dto/seeComments.dto';
import {
  SeeSubCommentsInput,
  SeeSubCommentsOutput,
} from './dto/seeSubComments.dto';
import {
  EditCommentInput,
  EditSubCommentInput,
} from './dto/update-comment.dto';
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
  async createComment(
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
  async editComment(
    user: User,
    { id, content }: EditCommentInput,
  ): Promise<CoreOutput> {
    try {
      const comment = await this.commentRepository.findOneBy({ id });
      if (!comment) {
        return {
          ok: false,
          error: '评论不存在',
        };
      }
      if (user.id !== comment.commenterId) {
        return {
          ok: false,
          error: '无权限编辑评论',
        };
      }
      comment.content = content;
      await this.commentRepository.save(comment);
      return {
        ok: true,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async seeComments({
    blogId,
    page = 1,
    limit = 20,
  }: SeeCommentsInput): Promise<SeeCommentsOutput> {
    try {
      const exist = await this.blogRepository.findOneBy({ id: blogId });
      if (!exist) {
        return {
          ok: false,
          error: '博客不存在',
        };
      }
      const [comments, rootCommentNum] =
        await this.commentRepository.findAndCount({
          where: { blog: { id: blogId } },
          take: limit,
          skip: (page - 1) * limit,
        });
      let totalComments = rootCommentNum;
      for (let i = 0; i < comments.length; i++) {
        const [subComments, count] =
          await this.subCommentRepository.findAndCount({
            where: { rootComment: { id: comments[i].id } },
            take: 4,
          });
        comments[i].subComments = subComments;
        comments[i].totalSubComments = count;
        totalComments += count;
      }
      return {
        ok: true,
        comments,
        totalComments,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async delComment(user: User, commentId: number): Promise<CoreOutput> {
    try {
      const comment = await this.commentRepository.findOneBy({ id: commentId });
      if (!comment) {
        return {
          ok: false,
          error: '评论不存在',
        };
      }
      if (user.id !== comment.commenterId) {
        return {
          ok: false,
          error: '无权限删除评论',
        };
      }
      await this.commentRepository.delete({ id: commentId });
      return {
        ok: true,
      };
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
  async createSubComment(
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
  async editSubComment(
    user: User,
    { id, content }: EditSubCommentInput,
  ): Promise<CoreOutput> {
    try {
      const subComment = await this.subCommentRepository.findOneBy({ id });
      if (!subComment) {
        return {
          ok: false,
          error: '评论不存在',
        };
      }
      if (user.id !== subComment.subCommenterId) {
        return {
          ok: false,
          error: '无权限编辑评论',
        };
      }
      subComment.content = content;
      await this.subCommentRepository.save(subComment);
      return {
        ok: true,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async delSubComment(user: User, subCommentId: number): Promise<CoreOutput> {
    try {
      const subComment = await this.subCommentRepository.findOneBy({
        id: subCommentId,
      });
      if (!subComment) {
        return {
          ok: false,
          error: '评论不存在',
        };
      }
      if (user.id !== subComment.subCommenterId) {
        return {
          ok: false,
          error: '无权限删除评论',
        };
      }
      await this.commentRepository.delete({ id: subCommentId });
      return {
        ok: true,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async seeSubComments({
    rootCommentId,
    limit = 10,
    page = 1,
  }: SeeSubCommentsInput): Promise<SeeSubCommentsOutput> {
    try {
      const exists = await this.commentRepository.findOneBy({
        id: rootCommentId,
      });
      if (!exists) {
        return {
          ok: false,
          error: '根评论不存在',
        };
      }
      const subComments = await this.subCommentRepository.find({
        where: { rootComment: { id: rootCommentId } },
        take: limit,
        skip: (page - 1) * limit,
      });
      return {
        ok: true,
        subComments,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
