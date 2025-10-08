import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AuthController (e2e)', () => {
    let app: INestApplication;
    let accessToken: string;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    it('/auth/register (POST) - registrar usuario nuevo', async () => {
        const email = `test${Date.now()}@mail.com`;
        const res = await request(app.getHttpServer())
            .post('/auth/register')
            .send({
                email,
                password: 'test1234',
                name: 'Usuario Prueba',
                last_name: 'Pruebas',
                cityId: '09379608-dfeb-406c-9945-63a8f83199fe',
                avatar: 'https://example.com/avatar.jpg',
            })
            .expect(201);

        expect(res.body).toHaveProperty('email', email);
        expect(res.body).toHaveProperty('id');
    });

    it('/auth/login (POST) - login correcto', async () => {
        const res = await request(app.getHttpServer())
            .post('/auth/login')
            .send({ email: 'hozkar178@gmail.com', password: 'pass' })
            .expect(201);

        expect(res.body).toHaveProperty('access_token');
        accessToken = res.body.access_token;
    });

    it('/auth/login-test (POST) - login de prueba', async () => {
        const res = await request(app.getHttpServer())
            .post('/auth/login-test')
            .send({ email: 'hozkar178@gmail.com', password: 'pass' })
            .expect(201);

        expect(res.body).toHaveProperty('access_token');
    });

    it('/auth/profile (GET) - debe devolver perfil autenticado', async () => {
        const res = await request(app.getHttpServer())
            .get('/auth/profile')
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200);

        expect(res.body).toHaveProperty('email', 'hozkar178@gmail.com');
    });

    it('/auth/logout (POST) - debe cerrar sesión', async () => {
        const res = await request(app.getHttpServer())
            .post('/auth/logout')
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200);

        expect(res.body).toEqual({ message: 'Logout exitoso' });
    });
});
