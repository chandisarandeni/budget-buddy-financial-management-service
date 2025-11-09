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
