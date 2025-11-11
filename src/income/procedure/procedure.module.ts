import { Module } from '@nestjs/common';
import { ProcedureService } from './procedure.service';
import { ProcedureController } from '../../saving/procedures/procedure.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Income } from '../entities/income.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Income])],
  controllers: [ProcedureController],
  providers: [],
})
export class ProcedureModule {}
