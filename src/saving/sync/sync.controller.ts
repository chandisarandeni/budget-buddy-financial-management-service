import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { SyncService } from './sync.service';

@Controller('saving/sync')
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  /**
   * 🔄 POST /budget/sync
   * Send local (SQLite) changes to the server
   */
  @Post()
  async syncFromMobile(@Body() payload: { localSavings: any[] }) {
    return this.syncService.syncSavings(payload.localSavings);
  }

  /**
   * 📥 GET /budget/sync?lastSync=2025-11-11T10:00:00Z
   * Get all updates from the server since last sync
   *    */
  @Get()
  async getServerUpdates(@Query('lastSync') lastSync: string) {
    return this.syncService.getServerUpdates(lastSync);
  }
}
