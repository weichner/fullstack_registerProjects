import { Test, TestingModule } from '@nestjs/testing';
import { ProjectUploadService } from './project-upload.service';

describe('ProjectUploadService', () => {
  let service: ProjectUploadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectUploadService],
    }).compile();

    service = module.get<ProjectUploadService>(ProjectUploadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
