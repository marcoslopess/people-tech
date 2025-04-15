import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { RedisService } from '../src/redis/redis.service';

describe('Redis Cache (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let redis: RedisService;
  let token: string;
  let userId: number;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await app.init();

    prisma = app.get(PrismaService);
    redis = app.get(RedisService);

    await prisma.user.deleteMany();
    await redis.getClient().flushall();

    const res = await request(app.getHttpServer()).post('/auth/login').send({
      name: 'Usuário Cache',
      email: 'cache@email.com',
      password: '123456',
    });

    token = res.body.access_token;

    // Cria um usuário que será consultado com e sem cache
    const userRes = await request(app.getHttpServer())
      .post('/users')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Usuario Cacheado',
        email: 'cacheado@email.com',
        password: '123456',
      });

    userId = userRes.body.id;
  });

  beforeEach(async () => {
    await redis.getClient().flushall();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /users/:id - deve salvar e retornar usuário do Redis cache', async () => {
    const spy = jest.spyOn(prisma.user, 'findUnique');

    // Primeira chamada: salva no cache
    const res1 = await request(app.getHttpServer())
      .get(`/users/${userId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res1.status).toBe(200);
    expect(res1.body.id).toBe(userId);
    expect(spy).toHaveBeenCalledTimes(1);

    // Segunda chamada: já deve estar no Redis
    const res2 = await request(app.getHttpServer())
      .get(`/users/${userId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res2.status).toBe(200);
    expect(res2.body.id).toBe(userId);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('GET /users/:id - deve retornar usuário do cache', async () => {
    // Primeira chamada: para garantir que o Redis armazene
    const first = await request(app.getHttpServer())
      .get(`/users/${userId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(first.status).toBe(200);

    // Segunda chamada: deve vir do cache
    const res = await request(app.getHttpServer())
      .get(`/users/${userId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(userId);
  });

  it('GET /users - deve retornar do cache quando disponível', async () => {
    const redisService = app.get(RedisService);
    const redisClient = redisService.getClient();

    const mockUsers = [
      {
        id: 999,
        name: 'Usuário Cache',
        email: 'cache@email.com',
        password: '***',
      },
    ];

    await redisClient.set('users', JSON.stringify(mockUsers), 'EX', 60);

    const res = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'Usuário Cache' }),
      ]),
    );

    await redisClient.del('users');
  });

  it('GET /users/:id - deve retornar 404 se o usuário não existir', async () => {
    const res = await request(app.getHttpServer())
      .get('/users/999999')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Usuário não encontrado');
  });
});
