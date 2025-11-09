import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IncomeModule } from './income/income.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ExpenseModule } from './expense/expense.module';
import { DataSourceOptions } from 'typeorm';
import { SavingModule } from './saving/saving.module';
import { BudgetModule } from './budget/budget.module';

@Module({
  imports: [
    // Load .env variables globally
    ConfigModule.forRoot({ isGlobal: true }),

    // Oracle Database Connection (with serviceName)
    TypeOrmModule.forRootAsync({
      useFactory: (): 
      DataSourceOptions => ({
        type: 'oracle',
        host: process.env.ORACLE_HOST,
        port: Number(process.env.ORACLE_PORT),
        username: process.env.ORACLE_USERNAME,
        password: process.env.ORACLE_PASSWORD,
        serviceName: process.env.ORACLE_SERVICE_NAME,
        synchronize: true,
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        logging: true,
        extra: {
          connectString: `${process.env.ORACLE_HOST}:${process.env.ORACLE_PORT}/${process.env.ORACLE_SERVICE_NAME}`,
        },
      }),
    }),

    IncomeModule,

    ExpenseModule,

    SavingModule,

    BudgetModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
