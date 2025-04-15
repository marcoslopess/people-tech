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

  enableShutdownHooks(app: INestApplication): void {
    (this as PrismaWithShutdown).$on('beforeExit', async () => {
      await app.close();
    });
  }
}
