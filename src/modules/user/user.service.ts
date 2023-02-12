import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserInput } from './dto/create-user.dto';
import { LoginInput, LoginOutput } from './dto/login.dto';
import { User, UserRole } from './entities/user.entity';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(createUserInput: CreateUserInput) {
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
          sub: user.id,
        }),
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
