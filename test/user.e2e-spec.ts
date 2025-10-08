import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { JwtService } from '@nestjs/jwt';

describe('UserController (e2e)', () => {
    let app: INestApplication;
    let jwtToken: string;
    let createdUserId: string;
    let resetToken: string;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
        await app.init();

        const jwtService = app.get(JwtService);
        jwtToken = jwtService.sign({
            sub: '44037b88-b7e6-4c9b-a28e-dac88a792c3a',
            email: 'hozkar178@gmail.com',
            role: 'admin',
        });
    });

    afterAll(async () => {
        await app.close();
    });

    it('/users (POST) ➝ debe crear un usuario', async () => {
        const res = await request(app.getHttpServer())
            .post('/users')
            .set('Authorization', `Bearer ${jwtToken}`)
            .send({
                name: 'UsuarioPrueba123456',
                last_name: 'Test',
                email: `test${Date.now()}@mail.com`,
                password: '123456',
                roleId: 'f7b3f982-1386-46df-9c69-dfbe2862069f',
            })
            .expect(201);

        expect(res.body.data).toHaveProperty('id');
        createdUserId = res.body.data.id;
    });

    it('/users (GET) ➝ debe listar usuarios', async () => {
        const res = await request(app.getHttpServer())
            .get('/users')
            .set('Authorization', `Bearer ${jwtToken}`)
            .expect(200);

        expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('/users/:id (GET) ➝ debe obtener un usuario por ID', async () => {
        const res = await request(app.getHttpServer())
            .get(`/users/${createdUserId}`)
            .set('Authorization', `Bearer ${jwtToken}`)
            .expect(200);

        expect(res.body.data).toHaveProperty('id', createdUserId);
    });

    it('/users/:id (PUT) ➝ debe actualizar completamente un usuario', async () => {
        const res = await request(app.getHttpServer())
            .put(`/users/${createdUserId}`)
            .set('Authorization', `Bearer ${jwtToken}`)
            .send({
                name: 'NombreActualizado',
                last_name: 'ApellidoActualizado',
            })
            .expect(200);

        expect(res.body.data.name).toBe('NombreActualizado');
    });

    it('/users/:id (PATCH) ➝ debe actualizar parcialmente un usuario', async () => {
        const res = await request(app.getHttpServer())
            .patch(`/users/${createdUserId}`)
            .set('Authorization', `Bearer ${jwtToken}`)
            .send({
                last_name: 'ApellidoPatch',
            })
            .expect(200);

        expect(res.body.data.last_name).toBe('ApellidoPatch');
    });

    it('/users/forgot-password (POST) ➝ debe generar token de reset', async () => {
        const res = await request(app.getHttpServer())
            .post('/users/forgot-password')
            .send({ email: 'hozkar178@gmail.com' })
            .expect(201);

        expect(res.body).toHaveProperty('token');
        resetToken = res.body.token;
    });

    it('/users/reset-password (POST) ➝ debe resetear la contraseña con token real', async () => {
        const res = await request(app.getHttpServer())
            .post('/users/reset-password')
            .send({
                email: 'hozkar178@gmail.com',
                token: resetToken,
                newPassword: 'nueva123',
            })
            .expect(201);

        expect(res.body.message).toBe('Contraseña actualizada correctamente');
    });

    it('/users/:id (DELETE) ➝ debe eliminar un usuario', async () => {
        const res = await request(app.getHttpServer())
            .delete(`/users/${createdUserId}`)
            .set('Authorization', `Bearer ${jwtToken}`)
            .expect(200);

        expect(res.body.data.id).toBe(createdUserId);
    });
});
