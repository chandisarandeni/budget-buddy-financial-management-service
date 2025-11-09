export class CreateExpenseDto {
  amount: number;
  payment_method: string;
  category: string;
  note: string;
  expenseDate: Date;
  userId: number;
}
