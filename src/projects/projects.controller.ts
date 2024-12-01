import {
  Controller,
  Get,
  Req,
  UseGuards,
  Post,
  Body,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('projects')
@UseGuards(RolesGuard)
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Get()
  @Roles('operational user', 'admin user')
  async findAll(@Req() request) {
    return await this.projectsService.findAll();
  }

  @Roles('operational user')
  @Post('report')
  async reportDedication(
    @Body('projectId') projectId: number,
    @Body('userId') userId: number,
    @Body('weekNumber') weekNumber: number,
    @Body('dedicationPercentage') dedicationPercentage: number,
  ) {
    const result = await this.projectsService.reportDedications({
      projectId,
      userId,
      weekNumber,
      dedicationPercentage,
    });

    if (!result.success) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    }

    return {
      message: 'Report created successfully',
    };
  }
}
