import { Module } from '@nestjs/common';
import { LoginModule } from './login/login.module';
import { UserModule } from './user/user.module';
import { BlogModule } from './blog/blog.module';
import { CommentModule } from './comment/comment.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import DatabaseConfig from './config/database';
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
    LoginModule,
    UserModule,
    BlogModule,
    CommentModule,
  ],
})
export class AppModule {}
