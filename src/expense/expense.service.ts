import { Injectable } from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { Expense } from './entities/expense.entity';
import { Between, LessThanOrEqual, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ExpenseService {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
  ) {}

  // CREATE NEW EXPENSE
  create(createExpenseDto: CreateExpenseDto) {
    //  if amount <= 0
    if (createExpenseDto.amount <= 0) {
      throw new Error('Amount must be greater than zero');
    }

    // Check all required fields are present
    const requiredFields = [
      'amount',
      'payment_method',
      'category',
      'expenseDate',
      'userId',
    ];
    for (const field of requiredFields) {
      if (!createExpenseDto[field]) {
        throw new Error(`Field ${field} is required`);
      }
    }

    // save to database
    const expense = this.expenseRepository.create(createExpenseDto);
    return this.expenseRepository.save(expense);
  }

  // GET ALL EXPENSES
  findAll() {
    return this.expenseRepository.find();
  }

  // FIND EXPENSE BY USER ID
  findByUserId(userId: number) {
    return this.expenseRepository.find({ where: { userId } });
  }

  // GET MONTHLY BUDGETS BY USER ID -> Pass Month and Year as well
  findMonthlyByUserId(userId: number, month: number, year: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);
    return this.expenseRepository.find({
      where: {
        userId,
        expenseDate: Between(startDate, endDate),
      },
    });
  }

  // GET EXPENSE BY ID
  findOne(id: number) {
    return this.expenseRepository.findOneBy({ id });
  }

  // UPDATE EXPENSE BY ID
  update(id: number, updateExpenseDto: UpdateExpenseDto) {
    // Check if expense exists
    if (!this.expenseRepository.findOneBy({ id })) {
      throw new Error(`Expense with ID ${id} not found`);
    }

    // update expense
    this.expenseRepository.update(id, updateExpenseDto);
    return this.expenseRepository.findOneBy({ id });
  }

  // DELETE EXPENSE BY ID
  remove(id: number) {
    // Check if expense exists
    if (!this.expenseRepository.findOneBy({ id })) {
      throw new Error(`Expense with ID ${id} not found`);
    }

    return this.expenseRepository.delete(id);
  }
}
