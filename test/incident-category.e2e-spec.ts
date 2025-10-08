import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('IncidentCategoryController (e2e)', () => {
  let app: INestApplication;
  let token: string;
  let createdId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    await app.init();

    //LOGIN
    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'hozkar178@gmail.com', password: 'pass' })
      .expect(200);

    token = loginRes.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  it('/incident-categories (POST) → crear categoría', async () => {
    const res = await request(app.getHttpServer())
      .post('/incident-categories')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Robo',
        description: 'Reportes relacionados con robos',
      })
      .expect(201);

    expect(res.body.message).toBe('Incident category created successfully');
    expect(res.body.data).toHaveProperty('id');
    createdId = res.body.data.id;
  });

  it('/incident-categories (GET) → listar categorías', async () => {
    const res = await request(app.getHttpServer())
      .get('/incident-categories')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body.message).toBe('Incident categories retrieved successfully');
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('/incident-categories/:id (GET) → obtener por ID', async () => {
    const res = await request(app.getHttpServer())
      .get(`/incident-categories/${createdId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body.message).toBe('Incident category retrieved successfully');
    expect(res.body.data.id).toBe(createdId);
  });

  it('/incident-categories/:id (PUT) → actualizar categoría', async () => {
    const res = await request(app.getHttpServer())
      .put(`/incident-categories/${createdId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Robo actualizado', description: 'Descripción nueva' })
      .expect(200);

    expect(res.body.message).toBe('Incident category updated successfully');
    expect(res.body.data.name).toBe('Robo actualizado');
  });

  it('/incident-categories/:id (PATCH) → actualizar parcialmente', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/incident-categories/${createdId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ description: 'Descripción parchada' })
      .expect(200);

    expect(res.body.message).toBe('Incident category updated successfully');
    expect(res.body.data.description).toBe('Descripción parchada');
  });

  it('/incident-categories/:id (DELETE) → eliminar categoría', async () => {
    const res = await request(app.getHttpServer())
      .delete(`/incident-categories/${createdId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body.message).toBe('Incident category deleted successfully');
  });
});