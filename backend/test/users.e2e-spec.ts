import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
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
    await prisma.user.deleteMany();

    // Criação do primeiro usuário
    const res = await request(app.getHttpServer()).post('/auth/login').send({
      name: 'Usuário Teste',
      email: 'teste@email.com',
      password: '123456',
    });

    token = res.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /users - deve criar um novo usuário', async () => {
    const res = await request(app.getHttpServer())
      .post('/users')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Outro Usuário',
        email: 'outro@email.com',
        password: '123456',
      });

    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    userId = res.body.id;
  });

  it('GET /users - deve retornar todos os usuários', async () => {
    const res = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /users/:id - deve retornar um usuário específico', async () => {
    const res = await request(app.getHttpServer())
      .get(`/users/${userId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(userId);
  });

  it('PUT /users/:id - deve atualizar um usuário', async () => {
    const res = await request(app.getHttpServer())
      .put(`/users/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Usuário Atualizado' });

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Usuário Atualizado');
  });

  it('POST /users - deve falhar ao tentar criar usuário com e-mail já existente', async () => {
    const res = await request(app.getHttpServer())
      .post('/users')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Usuário Duplicado',
        email: 'outro@email.com',
        password: '123456',
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('E-mail já está em uso');
  });

  it('DELETE /users/:id - deve remover um usuário', async () => {
    const res = await request(app.getHttpServer())
      .delete(`/users/${userId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(204);
  });
});
