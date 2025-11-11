import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Income } from '../entities/income.entity';
import { CreateIncomeDto } from '../dto/create-income.dto';
import { UpdateIncomeDto } from '../dto/update-income.dto';

@Injectable()
export class ProcedureService {
  constructor(
    @InjectRepository(Income)
    private readonly incomeRepository: Repository<Income>,
  ) {}

  // CREATE INCOME
  async create(createIncomeDto: CreateIncomeDto) {
    try {
      const { userId, source, amount, receivedDate } = createIncomeDto;

      if (!userId || !source || !amount || !receivedDate) {
        return {
          message: 'All fields are required',
          status: HttpStatus.BAD_REQUEST,
        };
      }

      await this.incomeRepository.query(
        `
        BEGIN
          manage_income(
            p_action       => 'INSERT',
            p_user_id      => :userId,
            p_source       => :source,
            p_amount       => :amount,
            p_received_date => TO_DATE(:receivedDate, 'YYYY-MM-DD')
          );
        END;
        `,
        [userId, source, amount, receivedDate],
      );

      return {
        message: 'Income created successfully',
        status: HttpStatus.CREATED,
      };
    } catch (error) {
      console.error('Error creating income:', error);
      return {
        message: 'Error while creating income',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  // GET ALL INCOMES
  async findAll() {
    return await this.incomeRepository.find({
      order: { receivedDate: 'DESC' },
    });
  }

  // GET INCOME BY ID
  async findOne(id: number) {
    return await this.incomeRepository.findOneBy({ id });
  }

  // GET INCOMES BY USER ID
  async findByUserId(userId: number) {
    return await this.incomeRepository.find({
      where: { userId },
      order: { receivedDate: 'DESC' },
    });
  }

  // GET MONTHLY INCOMES USING PROCEDURE (REF CURSOR)
  async getMonthlyIncomes(userId: number, month: number, year: number) {
    try {
      const result = await this.incomeRepository.query(
        `
        DECLARE
          c SYS_REFCURSOR;
        BEGIN
          get_monthly_incomes(:userId, :month, :year, c);
        END;
        `,
        [userId, month, year],
      );

      return result;
    } catch (error) {
      console.error('Error fetching monthly incomes:', error);
      return [];
    }
  }

  // UPDATE INCOME
  async update(id: number, updateIncomeDto: UpdateIncomeDto) {
    try {
      const income = await this.incomeRepository.findOneBy({ id });
      if (!income)
        return { message: 'Income not found', status: HttpStatus.NOT_FOUND };

      const { userId, source, amount, receivedDate } = updateIncomeDto;

      await this.incomeRepository.query(
        `
        BEGIN
          manage_income(
            p_action         => 'UPDATE',
            p_income_id      => :incomeId,
            p_user_id        => :userId,
            p_source         => :source,
            p_amount         => :amount,
            p_received_date  => TO_DATE(:receivedDate, 'YYYY-MM-DD')
          );
        END;
        `,
        [id, userId, source, amount, receivedDate],
      );

      return { message: 'Income updated successfully', status: HttpStatus.OK };
    } catch (error) {
      console.error('Error updating income:', error);
      return {
        message: 'Error while updating income',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  // DELETE INCOME
  async remove(id: number, userId: number) {
    try {
      const income = await this.incomeRepository.findOneBy({ id });
      if (!income)
        return { message: 'Income not found', status: HttpStatus.NOT_FOUND };

      await this.incomeRepository.query(
        `
        BEGIN
          manage_income(
            p_action     => 'DELETE',
            p_income_id  => :incomeId,
            p_user_id    => :userId
          );
        END;
        `,
        [id, userId],
      );

      return { message: 'Income deleted successfully', status: HttpStatus.OK };
    } catch (error) {
      console.error('Error deleting income:', error);
      return {
        message: 'Error while deleting income',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }
}
