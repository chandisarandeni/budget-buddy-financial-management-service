import { PartialType } from '@nestjs/mapped-types';
import { CreateIncomeDto } from './create-income.dto';

export class UpdateIncomeDto extends PartialType(CreateIncomeDto) {
  id: number;
  source: string;
  amount: number;
  dateReceived: Date;
  userId: number;
}
