import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';
import { mockPrismaService } from '../../prisma/__mocks__/prisma.service';

describe('UsersService', () => {
  let service: UsersService;
  let redisClient: any;

  beforeEach(async () => {
    redisClient = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
    };

    // Reset mocks antes de cada teste
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: RedisService,
          useValue: {
            getClient: () => redisClient,
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should create a user and invalidate cache', async () => {
    const user = {
      id: 1,
      name: 'João',
      email: 'joao@email.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockPrismaService.user.create.mockResolvedValue(user);

    const result = await service.create({ name: user.name, email: user.email });

    expect(mockPrismaService.user.create).toHaveBeenCalledWith({
      data: { name: user.name, email: user.email },
    });
    expect(redisClient.del).toHaveBeenCalledWith('users');
    expect(result).toEqual(user);
  });

  it('should return cached users if exists', async () => {
    const cachedUsers = [{ id: 1, name: 'Maria', email: 'maria@email.com' }];
    redisClient.get.mockResolvedValue(JSON.stringify(cachedUsers));

    const result = await service.findAll();

    expect(redisClient.get).toHaveBeenCalledWith('users');
    expect(result).toEqual(cachedUsers);
  });

  it('should return user from database and cache it', async () => {
    const user = {
      id: 2,
      name: 'Pedro',
      email: 'pedro@email.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    redisClient.get.mockResolvedValue(null);
    mockPrismaService.user.findUnique.mockResolvedValue(user);

    const result = await service.findOne(user.id);

    expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
      where: { id: user.id },
    });
    expect(redisClient.set).toHaveBeenCalledWith(
      `user:${user.id}`,
      JSON.stringify(user),
      'EX',
      60,
    );
    expect(result).toEqual(user);
  });

  it('should update a user and clear relevant caches', async () => {
    const userId = 3;
    const updatedUser = {
      id: userId,
      name: 'Atualizado',
      email: 'novo@email.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockPrismaService.user.update.mockResolvedValue(updatedUser);

    const result = await service.update(userId, {
      name: updatedUser.name,
      email: updatedUser.email,
    });

    expect(mockPrismaService.user.update).toHaveBeenCalledWith({
      where: { id: userId },
      data: { name: updatedUser.name, email: updatedUser.email },
    });

    expect(redisClient.del).toHaveBeenCalledWith('users');
    expect(redisClient.del).toHaveBeenCalledWith(`user:${userId}`);
    expect(result).toEqual(updatedUser);
  });

  it('should delete a user and clear relevant caches', async () => {
    const userId = 4;
    const deletedUser = {
      id: userId,
      name: 'Deletado',
      email: 'deletado@email.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockPrismaService.user.delete.mockResolvedValue(deletedUser);

    const result = await service.remove(userId);

    expect(mockPrismaService.user.delete).toHaveBeenCalledWith({
      where: { id: userId },
    });

    expect(redisClient.del).toHaveBeenCalledWith('users');
    expect(redisClient.del).toHaveBeenCalledWith(`user:${userId}`);
    expect(result).toEqual(deletedUser);
  });
});
