import { Test, TestingModule } from '@nestjs/testing';
import { ProjectUploadController } from './project-upload.controller';

describe('ProjectUploadController', () => {
  let controller: ProjectUploadController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectUploadController],
    }).compile();

    controller = module.get<ProjectUploadController>(ProjectUploadController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
