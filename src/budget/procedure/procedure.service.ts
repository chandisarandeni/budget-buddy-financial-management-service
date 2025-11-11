import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Budget } from '../entities/budget.entity';
import { CreateBudgetDto } from '../dto/create-budget.dto';
import { UpdateBudgetDto } from '../dto/update-budget.dto';

@Injectable()
export class ProcedureService {
  constructor(
    @InjectRepository(Budget)
    private readonly budgetRepository: Repository<Budget>,
  ) {}

  // CREATE BUDGET
  async create(createBudgetDto: CreateBudgetDto) {
    try {
      const { userId, category, amount, startDate, endDate } = createBudgetDto;

      if (!userId || !category || !amount || !startDate || !endDate) {
        return {
          message: 'All fields are required',
          status: HttpStatus.BAD_REQUEST,
        };
      }

      await this.budgetRepository.query(
        `
        BEGIN
          manage_budget(
            p_action   => 'INSERT',
            p_user_id  => :userId,
            p_category => :category,
            p_amount   => :amount,
            p_startDate => TO_DATE(:startDate, 'YYYY-MM-DD'),
            p_endDate   => TO_DATE(:endDate, 'YYYY-MM-DD')
          );
        END;
        `,
        [userId, category, amount, startDate, endDate],
      );

      return {
        message: 'Budget created successfully',
        status: HttpStatus.CREATED,
      };
    } catch (error) {
      console.error('Error creating budget:', error);
      return {
        message: 'Error while creating budget',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  // GET ALL BUDGETS
  async findAll() {
    return await this.budgetRepository.find({ order: { startDate: 'DESC' } });
  }

  // GET BUDGET BY ID
  async findOne(id: number) {
    return await this.budgetRepository.findOneBy({ id });
  }

  // GET BUDGETS BY USER ID
  async findByUserId(userId: number) {
    return await this.budgetRepository.find({
      where: { userId },
      order: { startDate: 'DESC' },
    });
  }

  // GET MONTHLY BUDGETS USING PROCEDURE (REF CURSOR)
  async getMonthlyBudgets(userId: number, month: number, year: number) {
    try {
      const result = await this.budgetRepository.query(
        `
        DECLARE
          c SYS_REFCURSOR;
        BEGIN
          get_monthly_budgets(:userId, :month, :year, c);
          -- Note: REF CURSOR returned as result set
        END;
        `,
        [userId, month, year],
      );

      return result;
    } catch (error) {
      console.error('Error fetching monthly budgets:', error);
      return [];
    }
  }

  // UPDATE BUDGET
  async update(id: number, updateBudgetDto: UpdateBudgetDto) {
    try {
      const budget = await this.budgetRepository.findOneBy({ id });
      if (!budget)
        return { message: 'Budget not found', status: HttpStatus.NOT_FOUND };

      const { userId, category, amount, startDate, endDate } = updateBudgetDto;

      await this.budgetRepository.query(
        `
        BEGIN
          manage_budget(
            p_action    => 'UPDATE',
            p_budget_id => :budgetId,
            p_user_id   => :userId,
            p_category  => :category,
            p_amount    => :amount,
            p_startDate => TO_DATE(:startDate, 'YYYY-MM-DD'),
            p_endDate   => TO_DATE(:endDate, 'YYYY-MM-DD')
          );
        END;
        `,
        [id, userId, category, amount, startDate, endDate],
      );

      return { message: 'Budget updated successfully', status: HttpStatus.OK };
    } catch (error) {
      console.error('Error updating budget:', error);
      return {
        message: 'Error while updating budget',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  // DELETE BUDGET
  async remove(id: number, userId: number) {
    try {
      const budget = await this.budgetRepository.findOneBy({ id });
      if (!budget)
        return { message: 'Budget not found', status: HttpStatus.NOT_FOUND };

      await this.budgetRepository.query(
        `
        BEGIN
          manage_budget(
            p_action    => 'DELETE',
            p_budget_id => :budgetId,
            p_user_id   => :userId
          );
        END;
        `,
        [id, userId],
      );

      return { message: 'Budget deleted successfully', status: HttpStatus.OK };
    } catch (error) {
      console.error('Error deleting budget:', error);
      return {
        message: 'Error while deleting budget',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }
}
