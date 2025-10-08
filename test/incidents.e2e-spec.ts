import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { JwtService } from '@nestjs/jwt';

describe('IncidentController (e2e)', () => {
  let app: INestApplication;
  let jwtToken: string;
  let createdIncidentId: string;

  const testUserId = '44037b88-b7e6-4c9b-a28e-dac88a792c3a';
  const testCategoryId = '319676c1-f3a0-465c-8ab2-6a912d4bdea2';
  const testCityId = '32efdfb7-e0ac-4902-9f5c-3a58c1a48e3f';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();

    const jwtService = app.get(JwtService);
    jwtToken = jwtService.sign({
      sub: testUserId,
      email: 'hozkar178@gmail.com',
      role: 'admin',
    });
  });

  afterAll(async () => {
    await app.close();
  });

  it('/incidents (POST) ➝ debe crear un incidente', async () => {
    const incidentPayload = {
      userId: testUserId,
      categoryId: testCategoryId,
      cityId: testCityId,
      description: 'Incidente de prueba e2e',
      reported_at: new Date().toISOString(),
      location: {
        type: 'Point',
        coordinates: [-74.08175, 4.60971],
      },
    };

    const res = await request(app.getHttpServer())
      .post('/incidents')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send(incidentPayload)
      .expect(201);

    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data.description).toBe('Incidente de prueba e2e');
    createdIncidentId = res.body.data.id;
  });

  it('/incidents (GET) ➝ debe listar incidentes', async () => {
    const res = await request(app.getHttpServer())
      .get('/incidents')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);

    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('/incidents/:id (GET) ➝ debe obtener un incidente por ID', async () => {
    const res = await request(app.getHttpServer())
      .get(`/incidents/${createdIncidentId}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);

    expect(res.body.data).toHaveProperty('id', createdIncidentId);
  });

  it('/incidents/:id (PUT) ➝ debe actualizar completamente un incidente', async () => {
    const updatedPayload = {
      userId: testUserId,
      categoryId: testCategoryId,
      cityId: testCityId,
      description: 'Incidente actualizado',
      reported_at: new Date().toISOString(),
      location: {
        type: 'Point',
        coordinates: [-74.0, 4.7],
      },
    };

    const res = await request(app.getHttpServer())
      .put(`/incidents/${createdIncidentId}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .send(updatedPayload)
      .expect(200);

    expect(res.body.data.description).toBe('Incidente actualizado');
  });

  it('/incidents/:id (PATCH) ➝ debe actualizar parcialmente un incidente', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/incidents/${createdIncidentId}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({
        description: 'Descripción parchada',
      })
      .expect(200);

    expect(res.body.data.description).toBe('Descripción parchada');
  });

  it('/incidents/user/:userId (GET) ➝ debe listar incidentes por usuario', async () => {
    const res = await request(app.getHttpServer())
      .get(`/incidents/user/${testUserId}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);

    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('/incidents/:id (DELETE) ➝ debe eliminar un incidente', async () => {
    const res = await request(app.getHttpServer())
      .delete(`/incidents/${createdIncidentId}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);

    expect(res.body.data.id).toBe(createdIncidentId);
  });
});
