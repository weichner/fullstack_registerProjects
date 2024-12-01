import { Module } from '@nestjs/common';
import { ProjectUploadService } from './project-upload.service';
import { ProjectUploadController } from './project-upload.controller';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from 'src/database/entities/project.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project]),
    MulterModule.register({
      dest: './src/uploads',
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '12h' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [ProjectUploadService],
  controllers: [ProjectUploadController],
})
export class ProjectUploadModule {}
