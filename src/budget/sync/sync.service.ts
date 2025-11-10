import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Budget } from '../entities/budget.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SyncService {
  constructor(
    @InjectRepository(Budget)
    private readonly budgetRepository: Repository<Budget>,
  ) {}

  /**
   * Receive local data from React Native (SQLite)
   * and synchronize with the server (Oracle)
   */
  async syncBudgets(localBudgets: any[]): Promise<any> {
    const results: { id: any; action: string }[] = [];

    for (const local of localBudgets) {
      const existing = await this.budgetRepository.findOne({
        where: { id: local.id },
      });

      if (!existing) {
        // 🟢 New record from mobile
        const newBudget = this.budgetRepository.create(local);
        await this.budgetRepository.save(newBudget);
        results.push({ id: local.id, action: 'created' });
      } else if (new Date(local.updatedAt) > new Date(existing.updatedAt)) {
        // 🟠 Updated record (mobile version is newer)
        await this.budgetRepository.update(local.id, local);
        results.push({ id: local.id, action: 'updated' });
      } else {
        // 🔵 Skip (server already has newer or same)
        results.push({ id: local.id, action: 'skipped' });
      }
    }

    return { message: 'Sync completed', results };
  }

  /**
   * Send server-side updates to mobile (for pull sync)
   * `lastSync` = timestamp of the last successful sync on mobile
   */
  async getServerUpdates(lastSync: string) {
    return this.budgetRepository
      .createQueryBuilder('budget')
      .where('budget.updatedAt > :lastSync', { lastSync })
      .getMany();
  }
}
