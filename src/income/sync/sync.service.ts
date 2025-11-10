import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Expense } from '../../expense/entities/expense.entity';
import { Repository } from 'typeorm';
import { Income } from '../entities/income.entity';

@Injectable()
export class SyncService {
  constructor(
    @InjectRepository(Income)
    private readonly incomeRepository: Repository<Income>,
  ) {}

  /**
   * Receive local data from React Native (SQLite)
   * and synchronize with the server (Oracle)
   */
  async syncExpenses(localExpenses: any[]): Promise<any> {
    const results: { id: any; action: string }[] = [];
    for (const local of localExpenses) {
      const existing = await this.incomeRepository.findOne({
        where: { id: local.id },
      });
      if (!existing) {
        // 🟢 New record from mobile
        const newIncome = this.incomeRepository.create(local);
        await this.incomeRepository.save(newIncome);
        results.push({ id: local.id, action: 'created' });
      } else if (new Date(local.updatedAt) > new Date(existing.updatedAt)) {
        // 🟠 Updated record (mobile version is newer)
        await this.incomeRepository.update(local.id, local);
        results.push({ id: local.id, action: 'updated' });
      } else {
        // 🔵 Skip (server already has newer or same)
        results.push({ id: local.id, action: 'skipped' });
      }
    }
    return results;
  }

  /**
   * Send server-side updates to mobile (for pull sync)
   * `lastSync` = timestamp of the last successful sync on mobile
   */
  async getServerUpdates(lastSync: string) {
    return this.incomeRepository
      .createQueryBuilder('income')
      .where('income.updatedAt > :lastSync', { lastSync })
      .getMany();
  }
}
