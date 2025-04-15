/* eslint-disable @typescript-eslint/no-misused-promises */
import { Injectable, INestApplication, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

type PrismaWithShutdown = PrismaClient & {
  $on(event: 'beforeExit', callback: () => void): void;
};

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication): Promise<void> {
    process.on('beforeExit', async () => {
      await app.close();
    });
  }
}
