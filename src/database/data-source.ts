import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from './entities/user.entity';
import { Report } from './entities/report.entity';
import { Project } from './entities/project.entity';
import { PostgresConfigService } from 'src/config/postgres.config.service';
import { ConfigModule } from '@nestjs/config';

ConfigModule.forRoot({ isGlobal: true });
const configService = new ConfigService();
const postgresConfigService = new PostgresConfigService(configService);

const dataBaseInfo = postgresConfigService.createTypeOrmOptions() as any;

export const dataSource = new DataSource({
  type: 'postgres',
  host: dataBaseInfo.host,
  port: dataBaseInfo.port,
  username: dataBaseInfo.username,
  password: dataBaseInfo.password,
  database: dataBaseInfo.database as string,
  entities: [User, Report, Project],
  synchronize: dataBaseInfo.synchronize,
  ssl: dataBaseInfo.ssl,
});
