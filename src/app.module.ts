import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IncomeModule } from './income/income.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ExpenseModule } from './expense/expense.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRoot({
      type: 'oracle',
      host: process.env.ORACLE_HOST,
      port: Number(process.env.ORACLE_PORT),
      username: process.env.ORACLE_USERNAME,
      password: process.env.ORACLE_PASSWORD,
      sid: process.env.ORACLE_SID,
      synchronize: true,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      logging: true,
    }),

    IncomeModule,

    ExpenseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
