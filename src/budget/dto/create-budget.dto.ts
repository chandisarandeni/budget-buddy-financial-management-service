export class CreateBudgetDto {
  category: string;
  amount: number;
  startDate: Date;
  endDate: Date;
  userId: number;
}
