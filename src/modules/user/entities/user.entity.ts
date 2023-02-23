import { CoreEntity } from 'src/entities/core.entity';
import { Blog } from 'src/modules/blog/entities/blog.entity';
import {
  Comment,
  SubComment,
} from 'src/modules/comment/entities/comment.entity';
import {
  Entity,
  Column,
  ManyToMany,
  JoinTable,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
  AfterLoad,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Like } from 'src/modules/like/entities/like.entity';
export enum UserRole {
  Visitor = 'Visitor',
  Client = 'Client',
  King = 'King',
}
@Entity()
export class User extends CoreEntity {
  @Column({ unique: true, length: 500 })
  @IsNotEmpty({ message: '用户名不能为空' })
  @IsString({ message: '参数必须为字符串格式' })
  username: string;

  @IsNotEmpty({ message: '密码不能为空' })
  @Column({ select: false })
  password: string;

  @Column({ nullable: true })
  @IsOptional()
  @IsString({ message: 'avatar必须为字符串格式' })
  avatar?: string;

  @Column({ nullable: true })
  @IsOptional()
  @IsString({ message: 'bio必须为字符串格式' })
  bio?: string;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @ManyToMany(() => User, (user) => user.followings)
  @JoinTable()
  followers: User[];

  @ManyToMany(() => User, (user) => user.followers)
  followings: User[];

  @OneToMany(() => Blog, (blog) => blog.author, { nullable: true })
  blogs: Blog[];

  @OneToMany(() => Comment, (comment) => comment.commenter)
  comments: Comment[];

  @OneToMany(() => SubComment, (subComment) => subComment.subCommenter)
  subComments: SubComment[];

  @OneToMany(() => Like, (like) => like.user)
  likes: Like[];

  totalFollowers: number;

  totalFollowings: number;

  posts: number;

  isMe: boolean = false;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    try {
      this.password = await bcrypt.hash(this.password, 10);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async checkPassword(password: string): Promise<boolean> {
    try {
      const compare = await bcrypt.compare(password, this.password);
      return compare;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
