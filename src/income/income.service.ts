import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Income } from './entities/income.entity';
import { Repository } from 'typeorm';

@Injectable()
export class IncomeService {
  constructor(
    @InjectRepository(Income)
    private readonly incomeRepository: Repository<Income>,
  ) {}

  // ADD NEW INCOME
  create(createIncomeDto: CreateIncomeDto) {
    // get source, amount, receivedDate and userId
    if (
      !createIncomeDto.source ||
      !createIncomeDto.amount ||
      !createIncomeDto.receivedDate ||
      !createIncomeDto.userId
    ) {
      return {
        message: 'Missing required fields',
        status: HttpStatus.BAD_REQUEST,
      };
    }

    const income = this.incomeRepository.create(createIncomeDto);
    return this.incomeRepository.save(income);
  }

  // GET ALL INCOMES
  findAll() {
    return this.incomeRepository.find();
  }

  // FIND INCOME BY USER ID
  findByUserId(userId: number) {
    return this.incomeRepository.find({ where: { userId } });
  }

  // GET INCOME BY ID
  findOne(id: number) {
    return this.incomeRepository.findOneBy({ id });
  }


  // UPDATE INCOME BY ID
  update(id: number, updateIncomeDto: UpdateIncomeDto) {
    // check if income exists
    if (!this.incomeRepository.findOneBy({ id })) {
      return {
        message: 'Income not found',
        status: HttpStatus.NOT_FOUND,
      };
    }

    // return updated income
    this.incomeRepository.update(id, updateIncomeDto);
    return this.incomeRepository.findOneBy({ id });
  }

  // DELETE INCOME BY ID
  remove(id: number) {
    if (!this.incomeRepository.findOneBy({ id })) {
      return {
        message: 'Income not found',
        status: HttpStatus.NOT_FOUND,
      };
    }
    return this.incomeRepository.delete(id);
  }
}
