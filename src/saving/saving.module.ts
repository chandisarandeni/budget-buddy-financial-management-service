import { Module } from '@nestjs/common';
import { SavingService } from './saving.service';
import { SavingController } from './saving.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Saving } from './entities/saving.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Saving])],
  controllers: [SavingController],
  providers: [SavingService],
})
export class SavingModule {}
