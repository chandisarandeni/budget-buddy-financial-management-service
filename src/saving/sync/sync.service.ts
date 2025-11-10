import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Saving } from '../entities/saving.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SyncService {
  constructor(
    @InjectRepository(Saving)
    private readonly savingRepository: Repository<Saving>,
  ) {}

  /**
   * Receive local data from React Native (SQLite)
   * and synchronize with the server (Oracle)
   */
  async syncSavings(localSavings: any[]): Promise<any> {
    const results: { id: any; action: string }[] = [];
    for (const local of localSavings) {
      const existing = await this.savingRepository.findOne({
        where: { id: local.id },
      });
      if (!existing) {
        // 🟢 New record from mobile
        const newSaving = this.savingRepository.create(local);
        await this.savingRepository.save(newSaving);
        results.push({ id: local.id, action: 'created' });
      } else if (new Date(local.updatedAt) > new Date(existing.updatedAt)) {
        // 🟠 Updated record (mobile version is newer)
        await this.savingRepository.update(local.id, local);
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
    return this.savingRepository
      .createQueryBuilder('saving')
      .where('saving.updatedAt > :lastSync', { lastSync })
      .getMany();
  }
}
