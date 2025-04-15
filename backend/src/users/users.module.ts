import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { RedisModule } from '../redis/redis.module'; // 👈 IMPORTANTE!

@Module({
  imports: [RedisModule], // 👈 AQUI ESTAVA FALTANDO
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
