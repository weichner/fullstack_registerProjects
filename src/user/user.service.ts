import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from 'src/database/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './DTO/create-user.dto';
import { Report } from 'src/database/entities/report.entity';
import { Project } from 'src/database/entities/project.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Report)
    private reportRepository: Repository<Report>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    private dataSource: DataSource,
  ) {}

  async findUserByName(name: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { name } });
  }

  async registerUser(input: CreateUserDto): Promise<User> {
    const { name, password, email, role } = input;

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = this.userRepository.create({
      name,
      password: hashedPassword,
      email,
      role,
    });

    return await this.userRepository.save(user);
  }

  async reportDedications(
    reports: {
      projectId: number;
      weekNumber: number;
      dedicationPercentage: number;
      userId: number;
    }[],
  ) {
    return this.dataSource.transaction(async (manager) => {
      const results = [];

      for (const reportData of reports) {
        const project = await manager.findOne(Project, {
          where: { id: reportData.projectId },
        });

        if (!project) {
          results.push({
            success: false,
            message: `Project not found ${reportData.projectId}`,
          });
        }

        const existingReport = await manager.findOne(Report, {
          where: {
            user: { id: reportData.userId },
            project: { id: reportData.projectId },
            weekNumber: reportData.weekNumber,
          },
        });
        if (existingReport) {
          results.push({
            success: false,
            message: `Report already exists for this week and project ${reportData.projectId} in week ${reportData.weekNumber}`,
          });
          continue;
        }

        const newReport = manager.create(Report, {
          weekNumber: reportData.weekNumber,
          dedicationPercentage: reportData.dedicationPercentage,
          user: { id: reportData.userId },
          project: { id: reportData.projectId },
        });

        await manager.save(newReport);
        results.push({ success: true, report: newReport });
      }
      return results;
    });
  }
}

// tomar horas de dedicacion de un usuario
// en un proyecto y convertilos en % de dedicacion en base a las horas de
// trabajo a la semana del empleado que serian 40hrs

// /user/:id/report-projects-dedication?week-number=5 ---> recibir lista de objs

//  [
//     {
//         "projectId": "88",
//   "userId": "1",
//   "weekNumber": "500",
//   "dedicationPercentage": "5"
//     },
//     {

//     }
// ]

// si lanzo la llamada con un id de un operational
// user no deberia dejarme lanzarla si paso un token de un admin user

// async reportDedications({
//     projectId,
//     weekNumber,
//     dedicationPercentage,
//     userId,
//   }: {
//     projectId: number;
//     weekNumber: number;
//     dedicationPercentage: number;
//     userId: number;
//   }) {
//     // Checks if project exists
//     const project = await this.projectRepository.findOne({
//       where: { id: projectId },
//     });
//     if (!project) {
//       return { success: false, message: 'Project not found' };
//     }

//     // Validate week number ISO
//     if (weekNumber < 1 || weekNumber > 52) {
//       return {
//         success: false,
//         message: 'Week number must be between 1 and 52',
//       };
//     }

//     // Chekcs for duplicate report
//     const existingReport = await this.reportRepository.findOne({
//       where: { user: { id: userId }, project: { id: projectId }, weekNumber },
//     });
//     if (existingReport) {
//       return {
//         success: false,
//         message: 'Report already exists for this week and project',
//       };
//     }

//     const report = this.reportRepository.create({
//       weekNumber,
//       dedicationPercentage,
//       user: { id: userId },
//       project: { id: projectId },
//     });
//     await this.reportRepository.save(report);
//     return { success: true, report };
//   }
