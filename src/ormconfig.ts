import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import dotenv from 'dotenv';
import { Income } from './income/entities/income.entity';
import { Expense } from './expense/entities/expense.entity';

dotenv.config();

const ormconfig: TypeOrmModuleOptions = {
  type: 'oracle',
  host: process.env.ORACLE_HOST,
  port: Number(process.env.ORACLE_PORT),
  username: process.env.ORACLE_USERNAME,
  password: process.env.ORACLE_PASSWORD?.replace(/"/g, ''), // remove quotes
  sid: process.env.ORACLE_SERVICE_NAME, // Service name, not SID
  synchronize: true,
  entities: [Income, Expense],
  logging: true,
};

export default ormconfig;
