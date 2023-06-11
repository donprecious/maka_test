import { DataSource } from 'typeorm';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT) || 5342,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: false,
  logging: true,
  entities: [
    // 'src/domain/entities/**/*.entity{.ts,.js}',
    __dirname + '/domain/entities/**/*.entity{.ts,.js}',
  ],

  migrations: [
    './' + 'src/infrastructure/persistence/typeorm/migration/**/*.ts',
  ],
});
