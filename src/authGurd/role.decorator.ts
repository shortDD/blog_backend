import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/modules/user/entities/user.entity';
export type AllowedRoles = keyof typeof UserRole;
export const Roles = (...roles: AllowedRoles[]) => SetMetadata('roles', roles);
