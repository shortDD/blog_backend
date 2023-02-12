import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { UserModule } from 'src/modules/user/user.module';
import { AuthGurd } from './auth.gurd';

@Module({
  imports: [UserModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGurd,
    },
  ],
})
export class AuthModule {}
