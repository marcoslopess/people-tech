import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
  ) {}

  async hasAny(): Promise<{ exists: boolean }> {
    const count = await this.prisma.user.count();
    return { exists: count > 0 };
  }

  async create(data: CreateUserDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existing) {
      throw new BadRequestException('E-mail já está em uso');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    return this.prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
      },
    });
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

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
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
