import { Module } from '@nestjs/common';
import { SyncService } from './sync.service';
import { SyncController } from './sync.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Expense } from '../entities/expense.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Expense])],
  controllers: [SyncController],
  providers: [SyncService],
})
export class SyncModule {}
