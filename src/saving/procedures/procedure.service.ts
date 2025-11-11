import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Saving } from '../entities/saving.entity';
import { CreateSavingDto } from '../dto/create-saving.dto';
import { UpdateSavingDto } from '../dto/update-saving.dto';

@Injectable()
export class SyncService {
  constructor(
    @InjectRepository(Saving)
    private readonly savingRepository: Repository<Saving>,
  ) {}

  // CREATE SAVING (uses manage_saving -> INSERT)
  async create(createSavingDto: CreateSavingDto) {
    try {
      const { userId, goalName, targetAmount, currentAmount, targetDate } =
        createSavingDto;

      if (
        !userId ||
        !goalName ||
        !targetAmount ||
        !currentAmount ||
        !targetDate
      ) {
        return {
          message: 'All fields are required',
          status: HttpStatus.BAD_REQUEST,
        };
      }

      await this.savingRepository.query(
        `
        BEGIN
          manage_saving(
            p_action => 'INSERT',
            p_user_id => :userId,
            p_goal_name => :goalName,
            p_target_amount => :targetAmount,
            p_current_amount => :currentAmount,
            p_target_date => TO_DATE(:targetDate, 'YYYY-MM-DD')
          );
        END;
        `,
        [userId, goalName, targetAmount, currentAmount, targetDate],
      );

      return {
        message: 'Saving created successfully',
        status: HttpStatus.CREATED,
      };
    } catch (error) {
      console.error('Error creating saving:', error);
      return {
        message: 'Error while creating saving',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  // GET ALL SAVINGS
  async findAll() {
    return await this.savingRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  // GET SAVING BY ID
  async findOne(id: number) {
    return await this.savingRepository.findOneBy({ id });
  }

  // GET SAVINGS BY USER ID
  async findByUserId(userId: number) {
    return await this.savingRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  // GET MONTHLY SAVINGS (using procedure)
  async getMonthlySavings(userId: number, month: number, year: number) {
    try {
      const result = await this.savingRepository.query(
        `
        DECLARE
          c SYS_REFCURSOR;
        BEGIN
          get_monthly_savings(:userId, :month, :year, c);
          -- fetch cursor results
        END;
        `,
        [userId, month, year],
      );

      return result; // array of savings for that month
    } catch (error) {
      console.error('Error fetching monthly savings:', error);
      return [];
    }
  }

  // UPDATE SAVING (uses manage_saving -> UPDATE)
  async update(id: number, updateSavingDto: UpdateSavingDto) {
    try {
      const saving = await this.savingRepository.findOneBy({ id });
      if (!saving)
        return { message: 'Saving not found', status: HttpStatus.NOT_FOUND };

      const { userId, goalName, targetAmount, currentAmount, targetDate } =
        updateSavingDto;

      await this.savingRepository.query(
        `
        BEGIN
          manage_saving(
            p_action => 'UPDATE',
            p_saving_id => :savingId,
            p_user_id => :userId,
            p_goal_name => :goalName,
            p_target_amount => :targetAmount,
            p_current_amount => :currentAmount,
            p_target_date => TO_DATE(:targetDate, 'YYYY-MM-DD')
          );
        END;
        `,
        [id, userId, goalName, targetAmount, currentAmount, targetDate],
      );

      return { message: 'Saving updated successfully', status: HttpStatus.OK };
    } catch (error) {
      console.error('Error updating saving:', error);
      return {
        message: 'Error while updating saving',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  // DELETE SAVING (uses manage_saving -> DELETE)
  async remove(id: number, userId: number) {
    try {
      const saving = await this.savingRepository.findOneBy({ id });
      if (!saving)
        return { message: 'Saving not found', status: HttpStatus.NOT_FOUND };

      await this.savingRepository.query(
        `
        BEGIN
          manage_saving(
            p_action => 'DELETE',
            p_saving_id => :savingId,
            p_user_id => :userId
          );
        END;
        `,
        [id, userId],
      );

      return { message: 'Saving deleted successfully', status: HttpStatus.OK };
    } catch (error) {
      console.error('Error deleting saving:', error);
      return {
        message: 'Error while deleting saving',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }
}
