import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AllowedRoles } from './role.decorator';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/modules/user/user.service';
@Injectable()
export class AuthGurd implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const roles = this.reflector.get<AllowedRoles[]>(
      'roles',
      context.getHandler(),
    );

    if (!roles) return true;
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.headers[process.env.TOKEN] as string;
    if (token) {
      const decoded = this.jwtService.verify(token);
      if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
        const { user } = await this.userService.userProfile({ id: decoded.id });
        if (user) {
          request.user = user;
          if (roles.includes('Any')) return true;
          return roles.includes(user.role);
        }
      }
    }
    return false;
  }
}
