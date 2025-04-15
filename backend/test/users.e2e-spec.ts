import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let userId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  it('POST /users - deve criar um novo usuário', async () => {
    const response = await request(app.getHttpServer())
      .post('/users')
      .send({ name: 'Teste E2E', email: 'e2e@teste.com' })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('Teste E2E');
    expect(response.body.email).toBe('e2e@teste.com');
    userId = response.body.id;
  });

  it('GET /users - deve listar os usuários', async () => {
    const response = await request(app.getHttpServer())
      .get('/users')
      .expect(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.find((u: any) => u.id === userId)).toBeDefined();
  });

  it('GET /users/:id - deve retornar o usuário criado', async () => {
    const response = await request(app.getHttpServer())
      .get(`/users/${userId}`)
      .expect(200);
    expect(response.body).toHaveProperty('id', userId);
  });

  it('PUT /users/:id - deve atualizar o usuário', async () => {
    const response = await request(app.getHttpServer())
      .put(`/users/${userId}`)
      .send({ name: 'Atualizado', email: 'atualizado@teste.com' })
      .expect(200);
    expect(response.body.name).toBe('Atualizado');
  });

  it('DELETE /users/:id - deve excluir o usuário', async () => {
    await request(app.getHttpServer()).delete(`/users/${userId}`).expect(204);

    await request(app.getHttpServer()).get(`/users/${userId}`).expect(404);
  });

  afterAll(async () => {
    await app.close();
  });
});
