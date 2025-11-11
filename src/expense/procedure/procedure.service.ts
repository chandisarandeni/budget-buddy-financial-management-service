import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expense } from '../entities/expense.entity';
import { CreateExpenseDto } from '../dto/create-expense.dto';
import { UpdateExpenseDto } from '../dto/update-expense.dto';

@Injectable()
export class ProcedureService {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
  ) {}

  // CREATE EXPENSE
  async create(createExpenseDto: CreateExpenseDto) {
    try {
      const { userId, category, amount, payment_method, note, expenseDate } =
        createExpenseDto;

      if (!userId || !category || !amount || !payment_method || !expenseDate) {
        return {
          message: 'All fields are required',
          status: HttpStatus.BAD_REQUEST,
        };
      }

      await this.expenseRepository.query(
        `
        BEGIN
          manage_expense(
            p_action       => 'INSERT',
            p_user_id      => :userId,
            p_category     => :category,
            p_amount       => :amount,
            p_payment_method => :paymentMethod,
            p_note         => :note,
            p_expense_date => TO_DATE(:expenseDate, 'YYYY-MM-DD')
          );
        END;
        `,
        [userId, category, amount, payment_method, note, expenseDate],
      );

      return {
        message: 'Expense created successfully',
        status: HttpStatus.CREATED,
      };
    } catch (error) {
      console.error('Error creating expense:', error);
      return {
        message: 'Error while creating expense',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  // GET ALL EXPENSES
  async findAll() {
    return await this.expenseRepository.find({
      order: { expenseDate: 'DESC' },
    });
  }

  // GET EXPENSE BY ID
  async findOne(id: number) {
    return await this.expenseRepository.findOneBy({ id });
  }

  // GET EXPENSES BY USER ID
  async findByUserId(userId: number) {
    return await this.expenseRepository.find({
      where: { userId },
      order: { expenseDate: 'DESC' },
    });
  }

  // GET MONTHLY EXPENSES USING PROCEDURE (REF CURSOR)
  async getMonthlyExpenses(userId: number, month: number, year: number) {
    try {
      const result = await this.expenseRepository.query(
        `
        DECLARE
          c SYS_REFCURSOR;
        BEGIN
          get_monthly_expenses(:userId, :month, :year, c);
        END;
        `,
        [userId, month, year],
      );

      return result;
    } catch (error) {
      console.error('Error fetching monthly expenses:', error);
      return [];
    }
  }

  // UPDATE EXPENSE
  async update(id: number, updateExpenseDto: UpdateExpenseDto) {
    try {
      const expense = await this.expenseRepository.findOneBy({ id });
      if (!expense)
        return { message: 'Expense not found', status: HttpStatus.NOT_FOUND };

      const { userId, category, amount, payment_method, note, expenseDate } =
        updateExpenseDto;

      await this.expenseRepository.query(
        `
        BEGIN
          manage_expense(
            p_action         => 'UPDATE',
            p_expense_id     => :expenseId,
            p_user_id        => :userId,
            p_category       => :category,
            p_amount         => :amount,
            p_payment_method => :paymentMethod,
            p_note           => :note,
            p_expense_date   => TO_DATE(:expenseDate, 'YYYY-MM-DD')
          );
        END;
        `,
        [id, userId, category, amount, payment_method, note, expenseDate],
      );

      return { message: 'Expense updated successfully', status: HttpStatus.OK };
    } catch (error) {
      console.error('Error updating expense:', error);
      return {
        message: 'Error while updating expense',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  // DELETE EXPENSE
  async remove(id: number, userId: number) {
    try {
      const expense = await this.expenseRepository.findOneBy({ id });
      if (!expense)
        return { message: 'Expense not found', status: HttpStatus.NOT_FOUND };

      await this.expenseRepository.query(
        `
        BEGIN
          manage_expense(
            p_action     => 'DELETE',
            p_expense_id => :expenseId,
            p_user_id    => :userId
          );
        END;
        `,
        [id, userId],
      );

      return { message: 'Expense deleted successfully', status: HttpStatus.OK };
    } catch (error) {
      console.error('Error deleting expense:', error);
      return {
        message: 'Error while deleting expense',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }
}
