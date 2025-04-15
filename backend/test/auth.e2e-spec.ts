import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let token: string;
  const email = `teste_${Date.now()}@email.com`;

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

    // Limpa a tabela de usuários antes dos testes
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /auth/exists - deve retornar false quando não há usuários', async () => {
    const res = await request(app.getHttpServer()).get('/auth/exists');
    expect(res.status).toBe(200);
    expect(res.body.exists).toBe(false);
  });

  it('POST /auth/login - deve criar o primeiro usuário', async () => {
    const res = await request(app.getHttpServer()).post('/auth/login').send({
      name: 'Usuário Teste',
      email,
      password: '123456',
    });

    expect(res.status).toBe(201);
    expect(res.body.access_token).toBeDefined();
    token = res.body.access_token;
  });

  it('POST /auth/exists - deve retornar true após a criação do usuário', async () => {
    const res = await request(app.getHttpServer()).get('/auth/exists');
    expect(res.status).toBe(200);
    expect(res.body.exists).toBe(true);
  });

  it('POST /auth/login - deve logar com usuário existente', async () => {
    const res = await request(app.getHttpServer()).post('/auth/login').send({
      email,
      password: '123456',
    });

    expect(res.status).toBe(201);
    expect(res.body.access_token).toBeDefined();
    token = res.body.access_token;
  });

  it('GET /auth/profile - deve retornar o perfil do usuário autenticado', async () => {
    const res = await request(app.getHttpServer())
      .get('/auth/profile')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.email).toBe(email);
    expect(res.body.sub).toBeDefined();
  });

  it('POST /auth/login - deve falhar com senha incorreta', async () => {
    const res = await request(app.getHttpServer()).post('/auth/login').send({
      email,
      password: 'senhaErrada',
    });

    expect(res.status).toBe(403);
    expect(res.body.message).toBe('Credenciais inválidas');
  });

  it('GET /auth/profile - deve falhar sem token', async () => {
    const res = await request(app.getHttpServer()).get('/auth/profile');
    expect(res.status).toBe(401);
  });

  it('POST /auth/login - deve criar o primeiro usuário com nome padrão', async () => {
    await prisma.user.deleteMany();

    const res = await request(app.getHttpServer()).post('/auth/login').send({
      email: 'semnome@email.com',
      password: '123456',
    });

    expect(res.status).toBe(201);
    expect(res.body.access_token).toBeDefined();

    const user = await prisma.user.findUnique({
      where: { email: 'semnome@email.com' },
    });

    expect(user?.name).toBe('Novo Usuário');
  });
});
