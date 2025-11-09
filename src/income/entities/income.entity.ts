import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('incomes')
export class Income {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  source: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'date' })
  receivedDate: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdDate: Date;

  // foreign key to users table
  @Column()
  userId: number;
}
