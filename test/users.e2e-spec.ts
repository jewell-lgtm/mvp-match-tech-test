import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createTestingApp } from './__support__/create-testing.app';
import { CreateUserDto } from '../src/users/create-user.dto';
import { CreateUserResponseDto } from '../src/users/create-user-response.dto';

describe('UsersController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await createTestingApp();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('CRUD for users', () => {
    describe('CREATE', () => {
      it('does not require authentication', async () => {
        const response = await request(app.getHttpServer())
          .post('/users')
          .set('Accept', 'application/json')
          .send({
            username: 'new user',
            password: 'password',
            role: 'seller',
          } as CreateUserDto);

        expect(response.status).toEqual(201);
      });
    });
    describe('READ', () => {
      it('requires authentication', async () => {
        const { id, token } = await registerUser();
        const failed = await request(app.getHttpServer()).get(`/users/${id}`);

        expect(failed.status).toEqual(401);

        const success = await request(app.getHttpServer())
          .get(`/users/${id}`)
          .set('Authorization', `Bearer ${token}`);

        expect(success.status).toEqual(200);
        expect(success.body).toHaveProperty('id', id);
      });
    });

    async function registerUser(): Promise<CreateUserResponseDto> {
      const response = await request(app.getHttpServer())
        .post('/users')
        .set('Accept', 'application/json')
        .send({
          username: 'new user',
          password: 'password',
          role: 'seller',
        } as CreateUserDto);

      return response.body;
    }
  });

  describe('/ (GET)', () => {
    it('should be implemented consuming and producing “application/json”', async () => {
      const response = await request(app.getHttpServer())
        .get('/')
        .set('Accept', 'application/json');

      expect(response).toHaveProperty(
        'header.content-type',
        expect.stringMatching(/^application\/json/),
      );
    });
  });
});
