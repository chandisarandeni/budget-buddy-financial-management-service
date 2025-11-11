import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BudgetService } from './budget.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';

@Controller('budget')
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  // CREATE BUDGET
  @Post()
  create(@Body() createBudgetDto: CreateBudgetDto) {
    return this.budgetService.create(createBudgetDto);
  }

  // GET ALL BUDGETS
  @Get()
  findAll() {
    return this.budgetService.findAll();
  }

  // GET BUDGETS BY USER ID
  @Get('user/:userId')
  findByUserId(@Param('userId') userId: string) {
    return this.budgetService.findByUserId(+userId);
  }

  // GET MONTHLY BUDGETS BY USER ID' -> Pass Month and Year as well
  @Get('user/:userId/month/:month/year/:year')
  findMonthlyByUserId(
    @Param('userId') userId: string,
    @Param('month') month: string,
    @Param('year') year: string,
  ) {
    return this.budgetService.findMonthlyByUserId(+userId, +month, +year);
  }

  // GET A BUDGET BY ID
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.budgetService.findOne(+id);
  }

  // UPDATE A BUDGET
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBudgetDto: UpdateBudgetDto) {
    return this.budgetService.update(+id, updateBudgetDto);
  }

  // DELETE A BUDGET
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.budgetService.remove(+id);
  }
}
