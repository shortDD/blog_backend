import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CoreOutput } from 'src/dto/core.dto';
import { Like, Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { CreateBlogInput, CreateBlogOutput } from './dto/create-blog.dto';
import {
  SeeBlogsByKeywordsInput,
  SeeBlogsByTagInput,
  SeeBlogsOutput,
} from './dto/see-blog.dto';
import { UpdateBlogInput } from './dto/update-blog.dto';
import { Blog } from './entities/blog.entity';
import { Read } from './entities/read.entity';
import { Tag } from './entities/tag.entity';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog) private readonly blogRepository: Repository<Blog>,
    @InjectRepository(Tag) private readonly tagRepository: Repository<Tag>,
    @InjectRepository(Read) private readonly readRepository: Repository<Read>,
  ) {}
  async createBlog(
    user: User,
    createBlogInput: CreateBlogInput,
  ): Promise<CreateBlogOutput> {
    try {
      //处理标签
      const { tags } = createBlogInput;
      const tagEntities = await this.createTag(tags);
      //创建阅读数量表单
      const read = new Read();
      read.readNum = 0;
      read.blog = await this.blogRepository.save(
        this.blogRepository.create({
          ...createBlogInput,
          tags: tagEntities,
          author: user,
          read,
        }),
      );
      await this.readRepository.save(read);
      return {
        ok: true,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }
  //编辑博客
  async editBlog(user: User, UpdateBlogInput: UpdateBlogInput) {
    try {
      const { blogId, data } = UpdateBlogInput;
      let blog = await this.blogRepository.findOneBy({ id: blogId });
      if (!blog || user.id != blog.authorId) {
        return {
          ok: false,
          error: `博客不存在或没有权限编辑ID:${blogId}的博客`,
        };
      }
      const tags = await this.createTag(data.tags);
      console.log(tags);
      await this.blogRepository.save(
        this.blogRepository.create({ ...blog, ...data, tags }),
      );
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  //删除博客
  async delBlog(user: User, blogId: number): Promise<CoreOutput> {
    try {
      const blog = await this.blogRepository.findOne({
        where: { id: blogId },
        relations: ['author'],
      });
      if (!blog) {
        return {
          ok: false,
          error: '博客不存在',
        };
      }
      if (user.id !== blog.authorId) {
        return {
          ok: false,
          error: '无权限删除该博客',
        };
      }
      await this.blogRepository.remove(blog);
      return {
        ok: true,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  //详情页查询
  async seeBlogById(id: number): Promise<CoreOutput & { blog?: Blog }> {
    try {
      const blog = await this.blogRepository.findOne({
        where: { id },
        relations: ['read'],
      });
      if (!blog) {
        return {
          ok: false,
          error: '未找到博客可能已经被删除',
        };
      }
      return {
        ok: true,
        blog,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }
  //标签查询
  async seeBlogsByTag({
    tagId,
    limit = 20,
    page = 1,
  }: SeeBlogsByTagInput): Promise<SeeBlogsOutput> {
    try {
      const tag = await this.tagRepository.findOne({
        where: { id: tagId },
        select: ['id'],
      });
      if (!tag) {
        return {
          ok: false,
          error: '标签不存在',
        };
      }
      const [blogs, blogNum] = await this.blogRepository.findAndCount({
        where: { tags: { id: tag.id } },
      });
      return {
        ok: true,
        blogs,
        blogNum,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  //模糊查询
  async seeBlogsByKeywords({
    keywords,
    limit = 20,
    page = 1,
  }: SeeBlogsByKeywordsInput): Promise<SeeBlogsOutput> {
    try {
      const [blogs, blogNum] = await this.blogRepository.findAndCount({
        where: [
          {
            title: Like(`%${keywords}%`),
          },
          {
            foreword: Like(`%${keywords}%`),
          },
        ],
      });
      return {
        ok: true,
        blogNum,
        blogs,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  //创建标签
  async createTag(tags: string[]) {
    try {
      const tagEntities: Tag[] = [];
      for (let i = 0; i < tags.length; i++) {
        let exist = await this.tagRepository.findOne({
          where: { tagname: tags[i] },
        });
        if (!exist) {
          exist = await this.tagRepository.save(
            this.tagRepository.create({ tagname: tags[i] }),
          );
        }
        tagEntities.push(exist);
      }
      return tagEntities;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }
}
