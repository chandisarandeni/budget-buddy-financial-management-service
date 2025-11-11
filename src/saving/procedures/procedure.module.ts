import { Module } from '@nestjs/common';
import { SyncController } from '../sync/sync.controller';
import { SyncService } from './procedure.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Saving } from '../entities/saving.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Saving])],
  controllers: [SyncController],
  providers: [SyncService],
})
export class ProcedureModule {}
