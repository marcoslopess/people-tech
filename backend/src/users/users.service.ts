import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
  ) {}

  async create(data: CreateUserDto) {
    const user = await this.prisma.user.create({ data });
    await this.redisService.getClient().del('users');
    return user;
  }

  async findAll() {
    const client = this.redisService.getClient();
    const cached = await client.get('users');
    if (cached) return JSON.parse(cached);

    const users = await this.prisma.user.findMany();
    await client.set('users', JSON.stringify(users), 'EX', 60);
    return users;
  }

  async findOne(id: number) {
    const client = this.redisService.getClient();
    const cached = await client.get(`user:${id}`);
    if (cached) return JSON.parse(cached);

    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Usuário não encontrado');

    await client.set(`user:${id}`, JSON.stringify(user), 'EX', 60);
    return user;
  }

  async update(id: number, data: UpdateUserDto) {
    const updated = await this.prisma.user.update({ where: { id }, data });
    const client = this.redisService.getClient();
    await client.del('users');
    await client.del(`user:${id}`);
    return updated;
  }

  async remove(id: number) {
    const removed = await this.prisma.user.delete({ where: { id } });
    const client = this.redisService.getClient();
    await client.del('users');
    await client.del(`user:${id}`);
    return removed;
  }
}
