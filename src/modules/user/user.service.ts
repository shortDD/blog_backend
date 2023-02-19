import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { CoreOutput } from 'src/dto/core.dto';
import { Repository } from 'typeorm';
import { CreateUserInput } from './dto/create-user.dto';
import { ProfileInput, ProfileOutput } from './dto/getProfile.dto';
import { LoginInput, LoginOutput } from './dto/login.dto';
import {
  SeeFollowersInput,
  SeeFollowersOutput,
  SeeFollowingsInput,
  SeeFollowingsOutput,
} from './dto/seeFollow.dto';
import { UpdateUserInput } from './dto/update-user.dto';
import { User, UserRole } from './entities/user.entity';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(createUserInput: CreateUserInput): Promise<CoreOutput> {
    try {
      const { username } = createUserInput;
      console.log(username);
      const exist = await this.userRepository.findOne({
        where: { username },
        select: { id: true },
      });
      if (exist) {
        return {
          ok: false,
          error: '用户已存在',
        };
      }
      const user = await this.userRepository.save(
        this.userRepository.create({
          ...createUserInput,
          role: UserRole.Client,
        }),
      );
      console.log(user);
      return {
        ok: true,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
  async editUser(
    user: User,
    { username, password, bio, avatar }: UpdateUserInput,
  ): Promise<CoreOutput> {
    try {
      if (!user)
        return {
          ok: false,
          error: '用户不存在',
        };
      await this.userRepository.update(user.id, {
        ...(username && { username }),
        ...(password && { password }),
        ...(bio && { bio }),
        ...(avatar && { avatar }),
      });
      return {
        ok: true,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
  async login(loginInput: LoginInput): Promise<LoginOutput> {
    try {
      const { username, password } = loginInput;
      const user = await this.userRepository.findOne({
        where: { username },
        select: ['id', 'password', 'username'],
      });
      if (!user || !(await user.checkPassword(password))) {
        return {
          ok: false,
          error: '账号或密码错误',
        };
      }
      return {
        ok: true,
        token: this.jwtService.sign({
          username: user.username,
          id: user.id,
        }),
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
  //获取个人信息 需登入
  async userProfile({ id, username }: ProfileInput): Promise<ProfileOutput> {
    try {
      const user = await this.userRepository.findOne({
        where: {
          ...(id && { id }),
          ...(username && { username }),
        },
        // relations: { followers: true, followings: true },
      });
      if (!user) {
        return {
          ok: false,
          error: '用户不存在',
        };
      }
      return {
        ok: true,
        user,
      };
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException(e);
    }
  }
  //关注||取消 用户
  async follow(user: User, to: number): Promise<CoreOutput> {
    const toUser = await this.userRepository.findOne({ where: { id: to } });
    if (!toUser) {
      return {
        ok: false,
        error: '关注的用户不存在',
      };
    }
    const fromUser = await this.userRepository.findOne({
      where: { id: user.id },
      relations: { followings: true },
    });
    const flag = fromUser.followings.some((user) => user.id === toUser.id);
    if (flag) {
      fromUser.followings = fromUser.followings.filter(
        (user) => user.id !== toUser.id,
      );
    } else {
      fromUser.followings.push(toUser);
    }
    await this.userRepository.save(fromUser);
    return {
      ok: true,
    };
  }
  //查看粉丝列表
  async seeFollowers({
    userId,
    limit = 20,
    page = 1,
  }: SeeFollowersInput): Promise<SeeFollowersOutput> {
    try {
      const exist = await this.userRepository.findOne({
        where: { id: userId },
        select: ['id'],
      });
      if (!exist) {
        return {
          ok: false,
          error: '用户不存在',
        };
      }
      const followers = await this.userRepository.find({
        where: { followings: { id: userId } },
        take: limit,
        skip: (page - 1) * limit,
      });
      return {
        ok: true,
        followers,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  //查看关注列表
  async seeFollowings({
    userId,
    limit = 20,
    page = 1,
  }: SeeFollowingsInput): Promise<SeeFollowingsOutput> {
    try {
      console.log(limit);
      const exist = await this.userRepository.findOne({
        where: { id: userId },
        select: ['id'],
      });
      if (!exist) {
        return {
          ok: false,
          error: '用户不存在',
        };
      }
      const followings = await this.userRepository.find({
        where: { followers: { id: userId } },
        take: limit,
        skip: (page - 1) * limit,
      });
      return {
        ok: true,
        followings,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
