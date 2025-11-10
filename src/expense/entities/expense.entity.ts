import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('expenses')
export class Expense {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  amount: number;

  @Column({ type: 'varchar', length: 255 })
  payment_method: string;

  @Column({ type: 'varchar', length: 255 })
  category: string;

  @Column({ type: 'varchar', length: 255 })
  note: string;

  @Column({ type: 'date' })
  expenseDate: Date;

  @Column({ type: 'int' })
  userId: number;

  @Column({ default: false })
  isDeleted: boolean;
}
