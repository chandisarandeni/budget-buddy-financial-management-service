import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('savings')
export class Saving {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  goalName: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  targetAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  currentAmount: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column()
  userId: number;
}
