import { Module } from '@nestjs/common';
import { IncomeService } from './income.service';
import { IncomeController } from './income.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Income } from './entities/income.entity';
import { SyncModule } from './sync/sync.module';

@Module({
  imports: [TypeOrmModule.forFeature([Income]), SyncModule],
  controllers: [IncomeController],
  providers: [IncomeService],
})
export class IncomeModule {}
