import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';

@Controller('expense')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  // CREATE EXPENSE
  @Post()
  create(@Body() createExpenseDto: CreateExpenseDto) {
    return this.expenseService.create(createExpenseDto);
  }

  // GET ALL EXPENSES
  @Get()
  findAll() {
    return this.expenseService.findAll();
  }

  // FIND EXPENSE BY USER ID
  @Get('user/:userId')
  findByUserId(@Param('userId') userId: string) {
    return this.expenseService.findByUserId(+userId);
  }

  // GET ALL NON-DELETED EXPENSES
  @Get('non-deleted')
  findAllNonDeleted() {
    return this.expenseService.findAllNonDeleted();
  }

  // GET EXPENSE BY ID
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.expenseService.findOne(+id);
  }

  // UPDATE EXPENSE BY ID
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExpenseDto: UpdateExpenseDto) {
    return this.expenseService.update(+id, updateExpenseDto);
  }

  // DELETE EXPENSE BY ID
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.expenseService.remove(+id);
  }
}
