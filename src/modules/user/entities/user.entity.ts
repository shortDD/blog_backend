import { CoreEntity } from 'src/entities/core.entity';
import { Blog } from 'src/modules/blog/entities/blog.entity';
import { Comment } from 'src/modules/comment/entities/comment.entity';
import {
  Entity,
  Column,
  ManyToMany,
  JoinTable,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
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

  @OneToMany(() => Blog, (blog) => blog.author)
  blogs: Blog[];

  @OneToMany(() => Comment, (comment) => comment.commenter)
  comments: Comment[];

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
      console.log(compare);

      return compare;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}