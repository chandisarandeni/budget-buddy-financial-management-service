import { Module } from '@nestjs/common';
import { SyncService } from './sync.service';
import { SyncController } from './sync.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Income } from '../entities/income.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Income])],
  controllers: [SyncController],
  providers: [SyncService],
})
export class SyncModule {}
