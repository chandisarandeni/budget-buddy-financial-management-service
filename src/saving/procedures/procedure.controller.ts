import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  HttpStatus,
} from '@nestjs/common';
import { SyncService } from './procedure.service';
import { CreateSavingDto } from '../dto/create-saving.dto';
import { UpdateSavingDto } from '../dto/update-saving.dto';

@Controller('savings/procedure')
export class ProcedureController {
  constructor(private readonly syncService: SyncService) {}

  // CREATE SAVING
  @Post()
  async create(@Body() createSavingDto: CreateSavingDto) {
    return await this.syncService.create(createSavingDto);
  }

  // GET ALL SAVINGS
  @Get()
  async findAll() {
    return await this.syncService.findAll();
  }

  // GET SAVING BY ID
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.syncService.findOne(id);
  }

  // GET SAVINGS BY USER ID
  @Get('user/:userId')
  async findByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return await this.syncService.findByUserId(userId);
  }

  // GET MONTHLY SAVINGS BY USER ID, MONTH, YEAR
  @Get('user/:userId/monthly')
  async getMonthlySavings(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('month', ParseIntPipe) month: number,
    @Query('year', ParseIntPipe) year: number,
  ) {
    return await this.syncService.getMonthlySavings(userId, month, year);
  }

  // UPDATE SAVING
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSavingDto: UpdateSavingDto,
  ) {
    return await this.syncService.update(id, updateSavingDto);
  }

  // DELETE SAVING
  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Query('userId', ParseIntPipe) userId: number,
  ) {
    return await this.syncService.remove(id, userId);
  }
}
