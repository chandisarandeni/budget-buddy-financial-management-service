import { Injectable } from '@nestjs/common';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Budget } from './entities/budget.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BudgetService {
  constructor(
    @InjectRepository(Budget)
    private budgetRepository: Repository<Budget>,
  ) {}

  // CREATE BUDGET
  create(createBudgetDto: CreateBudgetDto) {
    // Check all required fields
    if (
      !createBudgetDto.amount ||
      !createBudgetDto.category ||
      !createBudgetDto.startDate ||
      !createBudgetDto.endDate ||
      !createBudgetDto.userId
    ) {
      return 'All fields are required';
    }

    // Save the new budget entity
    const newBudget = this.budgetRepository.create(createBudgetDto);
    return this.budgetRepository.save(newBudget);
  }

  // GET ALL BUDGETS
  findAll() {
    return this.budgetRepository.find();
  }

  // GET A BUDGET BY ID
  findOne(id: number) {
    return this.budgetRepository.findOneBy({ id });
  }

  // UPDATE A BUDGET
  update(id: number, updateBudgetDto: UpdateBudgetDto) {
    // Check if budget exists
    if (!this.budgetRepository.findOneBy({ id })) {
      return `Budget with ID ${id} not found`;
    }

    // Update the budget entity
    this.budgetRepository.update(id, updateBudgetDto);
    return this.budgetRepository.findOneBy({ id });
  }

  remove(id: number) {
    // check if budget exists
    if (!this.budgetRepository.findOneBy({ id })) {
      return `Budget with ID ${id} not found`;
    }

    return this.budgetRepository.delete(id);
  }
}
