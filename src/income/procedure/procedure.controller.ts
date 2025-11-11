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
} from '@nestjs/common';
import { ProcedureService } from './procedure.service';
import { CreateIncomeDto } from '../dto/create-income.dto';
import { UpdateIncomeDto } from '../dto/update-income.dto';

@Controller('expenses/procedure')
export class ExpenseProcedureController {
  constructor(private readonly procedureService: ProcedureService) {}

  @Post()
  async create(@Body() createIncomeDto: CreateIncomeDto) {
    return await this.procedureService.create(createIncomeDto);
  }

  @Get()
  async findAll() {
    return await this.procedureService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.procedureService.findOne(id);
  }

  @Get('user/:userId')
  async findByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return await this.procedureService.findByUserId(userId);
  }

  @Get('user/:userId/monthly')
  async getMonthlyExpenses(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('month', ParseIntPipe) month: number,
    @Query('year', ParseIntPipe) year: number,
  ) {
    return await this.procedureService.getMonthlyIncomes(userId, month, year);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateIncomeDto: UpdateIncomeDto,
  ) {
    return await this.procedureService.update(id, updateIncomeDto);
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Query('userId', ParseIntPipe) userId: number,
  ) {
    return await this.procedureService.remove(id, userId);
  }
}
