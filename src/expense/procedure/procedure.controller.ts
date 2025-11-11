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
import { CreateExpenseDto } from '../dto/create-expense.dto';
import { UpdateExpenseDto } from '../dto/update-expense.dto';

@Controller('expenses/procedure')
export class ExpenseProcedureController {
  constructor(private readonly procedureService: ProcedureService) {}

  @Post()
  async create(@Body() createExpenseDto: CreateExpenseDto) {
    return await this.procedureService.create(createExpenseDto);
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
    return await this.procedureService.getMonthlyExpenses(userId, month, year);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateExpenseDto: UpdateExpenseDto,
  ) {
    return await this.procedureService.update(id, updateExpenseDto);
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Query('userId', ParseIntPipe) userId: number,
  ) {
    return await this.procedureService.remove(id, userId);
  }
}
