import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from 'src/database/entities/project.entity';
import { Report } from 'src/database/entities/report.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(Report)
    private reportRepository: Repository<Report>,
  ) {}

  async findAll(): Promise<Project[]> {
    return this.projectRepository.find();
  }

  async reportDedications({
    projectId,
    weekNumber,
    dedicationPercentage,
    userId,
  }: {
    projectId: number;
    weekNumber: number;
    dedicationPercentage: number;
    userId: number;
  }) {
    // Checks if project exists
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
    });
    if (!project) {
      return { success: false, message: 'Project not found' };
    }

    // Validate week number ISO
    if (weekNumber < 1 || weekNumber > 52) {
      return {
        success: false,
        message: 'Week number must be between 1 and 52',
      };
    }

    // Chekcs for duplicate report
    const existingReport = await this.reportRepository.findOne({
      where: { user: { id: userId }, project: { id: projectId }, weekNumber },
    });
    if (existingReport) {
      return {
        success: false,
        message: 'Report already exists for this week and project',
      };
    }

    const report = this.reportRepository.create({
      weekNumber,
      dedicationPercentage,
      user: { id: userId },
      project: { id: projectId },
    });
    await this.reportRepository.save(report);
    return { success: true, report };
  }
}

// tomar horas de dedicacion de un usuario
// en un proyecto y convertilos en % de dedicacion en base a las horas de
// trabajo a la semana del empleado que serian 40hrs

// /user/:id/report-projects-dedication?week-number=5 ---> recibir lista de objs

// si lanzo la llamada con un id de un operational
// user no deberia dejarme lanzarla si paso un token de un admin user
