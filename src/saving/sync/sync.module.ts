import { Module } from '@nestjs/common';
import { SyncService } from './sync.service';
import { SyncController } from './sync.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Saving } from '../entities/saving.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Saving])],
  controllers: [SyncController],
  providers: [SyncService],
})
export class SyncModule {}
