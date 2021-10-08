import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createTestingApp } from './__support__/create-testing.app';
import { CreateUserDto } from '../src/users/create-user.dto';
import { CreateUserResponseDto } from '../src/users/create-user-response.dto';
import { Connection } from 'typeorm';
import { User } from '../src/users/user.entity';

const username = 'new user';
describe('UsersController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await createTestingApp();
    await app.get(Connection).getRepository(User).delete({ username });
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
            username,
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

        const me = await request(app.getHttpServer())
          .get(`/users/me`)
          .set('Authorization', `Bearer ${token}`);

        expect(me.status).toEqual(200);

        expect(me.body).toHaveProperty('id', id);

        const withId = await request(app.getHttpServer())
          .get(`/users/${id}`)
          .set('Authorization', `Bearer ${token}`);

        expect(withId.status).toEqual(200);
        expect(withId.body).toHaveProperty('id', id);
      });
    });

    async function registerUser(): Promise<CreateUserResponseDto> {
      const response = await request(app.getHttpServer())
        .post('/users')
        .set('Accept', 'application/json')
        .send({
          username: username,
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
