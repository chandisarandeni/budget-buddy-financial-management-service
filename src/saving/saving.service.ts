import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateSavingDto } from './dto/create-saving.dto';
import { UpdateSavingDto } from './dto/update-saving.dto';
import { Saving } from './entities/saving.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';

@Injectable()
export class SavingService {
  constructor(
    @InjectRepository(Saving)
    private readonly savingRepository: Repository<Saving>,
  ) {}

  // ADD NEW SAVING
  create(createSavingDto: CreateSavingDto) {
    // Check all fields are filled
    if (
      !createSavingDto.goalName ||
      !createSavingDto.targetAmount ||
      !createSavingDto.currentAmount ||
      !createSavingDto.userId
    ) {
      return {
        message: 'All fields are required',
        status: HttpStatus.BAD_REQUEST,
      };
    }

    // Create new saving
    const newSaving = this.savingRepository.create(createSavingDto);
    return this.savingRepository.save(newSaving);
  }

  // GET ALL SAVINGS
  findAll() {
    return this.savingRepository.find();
  }

  // FIND SAVING BY USER ID
  findByUserId(userId: number) {
    return this.savingRepository.find({ where: { userId } });
  }

  // GET MONTHLY BUDGETS BY USER ID -> Pass Month and Year as well
  findMonthlyByUserId(userId: number, month: number, year: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);
    return this.savingRepository.find({
      where: {
        userId,
        createdAt: Between(startDate, endDate),
      },
    });
  }

  // GET SAVING BY ID
  findOne(id: number) {
    return this.savingRepository.findOneBy({ id });
  }

  // UPDATE SAVING BY ID
  update(id: number, updateSavingDto: UpdateSavingDto) {
    // Check if saving exists
    const saving = this.savingRepository.findOneBy({ id });
    if (!saving) {
      return {
        message: 'Saving not found',
        status: HttpStatus.NOT_FOUND,
      };
    }

    // Update saving
    this.savingRepository.update(id, updateSavingDto);
    return this.savingRepository.findOneBy({ id });
  }

  // DELETE SAVING BY ID
  remove(id: number) {
    // Check if saving exists
    const saving = this.savingRepository.findOneBy({ id });
    if (!saving) {
      return {
        message: 'Saving not found',
        status: HttpStatus.NOT_FOUND,
      };
    }

    // Delete saving
    this.savingRepository.delete(id);
    return {
      message: 'Saving deleted successfully',
      status: HttpStatus.OK,
    };
  }
}
