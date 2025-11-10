export class CreateBudgetDto {
  id?: number; // optional because SQLite might generate it locally
  category: string;
  amount: number;
  startDate: Date;
  endDate: Date;
  userId: number;

  // Added for synchronization support
  updatedAt?: Date;
  isDeleted?: boolean;
}
