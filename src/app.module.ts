import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { BlogModule } from './modules/blog/blog.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentModule } from './modules/comment/comment.module';
import DatabaseConfig from './config/database';
import { AuthModule } from './authGurd/auth.module';
import { JwtGlobalModule } from './modules/jwt/jwt.module';
import { UploadModule } from './modules/upload/upload.module';
import { LikeModule } from './modules/like/like.module';
import { RequestContextModule } from 'nestjs-request-context';
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [DatabaseConfig],
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'development' ? '.env.development' : '',
      ignoreEnvFile: process.env.NODE_ENV === 'production',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config) => config.get('database'),
    }),
    UserModule,
    BlogModule,
    CommentModule,
    AuthModule,
    JwtGlobalModule,
    UploadModule,
    LikeModule,
    RequestContextModule,
  ],
})
export class AppModule {}
