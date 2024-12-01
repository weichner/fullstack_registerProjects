import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from 'src/database/entities/project.entity';
import * as fs from 'fs';
import * as csvParser from 'csv-parser';
import * as XLSX from 'xlsx';

@Injectable()
export class ProjectUploadService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  private async processFile(
    filePath: string,
    fileType: 'csv' | 'excel',
  ): Promise<void> {
    const uniqueProjects = new Map<string, Partial<Project>>();
    let data: Array<{
      name: string;
      description: string;
      project_code: string;
    }> = [];

    if (fileType === 'csv') {
      const stream = fs.createReadStream(filePath).pipe(csvParser());
      for await (const row of stream) {
        if (!row.project_code) {
          throw new Error('Project code is required');
        }
        data.push({
          name: row.name,
          description: row.description,
          project_code: row.project_code,
        });
      }
    } else if (fileType === 'excel') {
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    }

    for (const row of data) {
      const project = {
        name: row.name,
        description: row.description,
        project_code: row.project_code,
      };
      uniqueProjects.set(project.project_code, project);
    }

    await this.projectRepository.upsert(
      [...uniqueProjects.values()],
      ['project_code'],
    );
  }

  async processFinalFile(file: Express.Multer.File): Promise<void> {
    const extension = file.originalname.split('.').pop().toLowerCase();

    if (extension === 'csv') {
      await this.processFile(file.path, 'csv');
    } else if (extension === 'xlsx' || extension === 'xls') {
      await this.processFile(file.path, 'excel');
    } else {
      throw new Error('Invalid file format');
    }

    fs.unlinkSync(file.path);
  }
}

// private async processCsv(filePath: string): Promise<void> {
//     const projects: Partial<Project>[] = [];
//     const uniqueProjects = new Map<string, Partial<Project>>();
//     const stream = fs.createReadStream(filePath).pipe(csvParser());

//     for await (const row of stream) {
//       if (!row.project_code) {
//         throw new Error('Project code is required');
//       }
//       const project = {
//         name: row.name,
//         description: row.description,
//         project_code: row.project_code,
//       };
//       // projects.push(project);
//       uniqueProjects.set(project.project_code, project);
//     }

//     //await this.projectRepository.upsert(projects, ['project_code']);
//     await this.projectRepository.upsert(
//       [...uniqueProjects.values()],
//       ['project_code'],
//     );
//   }

//   private async processExcel(filePath: string): Promise<void> {
//     const workbook = XLSX.readFile(filePath);
//     const sheetName = workbook.SheetNames[0];
//     const data: Array<{
//       name: string;
//       description: string;
//       project_code: string;
//     }> = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

//     const uniqueProjects = new Map<string, Partial<Project>>();

//     for (const row of data) {
//       if (!row.project_code) {
//         throw new Error('Project code is required');
//       }

//       const project = {
//         name: row.name,
//         description: row.description,
//         project_code: row.project_code,
//       };

//       // Agrega solo los proyectos con códigos únicos al mapa
//       uniqueProjects.set(project.project_code, project);
//     }

//     // Convierte el mapa a un array y guarda en la base de datos
//     await this.projectRepository.upsert(
//       [...uniqueProjects.values()],
//       ['project_code'],
//     );
//   }
