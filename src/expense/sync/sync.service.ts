import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Expense } from '../entities/expense.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SyncService {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
  ) {}

  /**
   * Receive local data from React Native (SQLite)
   * and synchronize with the server (Oracle)
   */
  async syncExpenses(localExpenses: any[]): Promise<any> {
    const results: { id: any; action: string }[] = [];

    for (const local of localExpenses) {
      const existing = await this.expenseRepository.findOne({
        where: { id: local.id },
      });
      if (!existing) {
        // 🟢 New record from mobile
        const newExpense = this.expenseRepository.create(local);
        await this.expenseRepository.save(newExpense);
        results.push({ id: local.id, action: 'created' });
      } else if (new Date(local.updatedAt) > new Date(existing.updatedAt)) {
        // 🟠 Updated record (mobile version is newer)
        await this.expenseRepository.update(local.id, local);
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
    return this.expenseRepository
      .createQueryBuilder('expense')
      .where('expense.updatedAt > :lastSync', { lastSync })
      .getMany();
  }
}
