import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProjectUploadService } from './project-upload.service';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('projects/upload')
@UseGuards(RolesGuard)
export class ProjectUploadController {
  constructor(private projectUploadService: ProjectUploadService) {}

  @Post()
  @Roles('admin user')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    await this.projectUploadService.processFinalFile(file);
    return { message: 'File uploaded successfully' };
  }
}
