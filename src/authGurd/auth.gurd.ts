import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
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
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.headers[process.env.TOKEN] as string;
    if (token) {
      const decoded = this.jwtService.verify(token);
      if (typeof decoded === 'object' && decoded.hasOwnProperty('sub')) {
        const id = decoded.sub;
      }
    }
    const roles = this.reflector.get<AllowedRoles[]>(
      'roles',
      context.getHandler(),
    );
    if (!roles) return true;
    if (roles.includes('King')) return true;
    return false;
  }
}
