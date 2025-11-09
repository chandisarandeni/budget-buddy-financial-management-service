import { Injectable } from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { Expense } from './entities/expense.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ExpenseService {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
  ) {}
  create(createExpenseDto: CreateExpenseDto) {
    //  if amount <= 0
    if (createExpenseDto.amount <= 0) {
      throw new Error('Amount must be greater than zero');
    }

    // Check all required fields are present
    const requiredFields = ['description', 'amount', 'date', 'category'];
    for (const field of requiredFields) {
      if (!createExpenseDto[field]) {
        throw new Error(`Field ${field} is required`);
      }
    }

    // save to database
    const expense = this.expenseRepository.create(createExpenseDto);
    return this.expenseRepository.save(expense);
  }

  findAll() {
    return `This action returns all expense`;
  }

  findOne(id: number) {
    return `This action returns a #${id} expense`;
  }

  update(id: number, updateExpenseDto: UpdateExpenseDto) {
    return `This action updates a #${id} expense`;
  }

  remove(id: number) {
    return `This action removes a #${id} expense`;
  }
}
