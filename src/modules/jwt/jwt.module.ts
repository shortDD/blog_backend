import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({ secret: process.env.SECRET_KEY }),
    }),
  ],
  exports: [JwtModule],
})
export class JwtGlobalModule {}
