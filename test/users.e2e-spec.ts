import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createTestingApp } from './__support__/create-testing.app';
import { CreateUserDto } from '../src/users/create-user.dto';
import { Connection } from 'typeorm';
import { User } from '../src/users/user.entity';

const username = 'new user';
const password = 'test1234!@£';

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
            password,
            role: 'seller',
          } as CreateUserDto);

        expect(response.status).toEqual(201);
      });
    });
    describe('READ', () => {
      let id: number;
      let token: string;
      beforeEach(async () => {
        const response = await registerUser();
        id = response.body.id;
        token = response.body.token;
      });
      it('fails when requesting without a token', async () => {
        const failed = await request(app.getHttpServer()).get(`/users/me`);
        expect(failed.status).toEqual(401);
      });
      it('allows a user to fetch themselves', async () => {
        const me = await request(app.getHttpServer())
          .get(`/users/me`)
          .set('Authorization', `Bearer ${token}`);

        expect(me.status).toEqual(200);
        expect(me.body).toHaveProperty('id', id);
      });
      it('does not let a user fetch a user by arbitrary id', async () => {
        const withId = await request(app.getHttpServer())
          .get(`/users/${id}`)
          .set('Authorization', `Bearer ${token}`);

        expect(withId.status).toEqual(403);
      });
      it.todo('allows admin to fetch arbitrary users');

      function registerUser() {
        return request(app.getHttpServer())
          .post('/users')
          .set('Accept', 'application/json')
          .send({
            username,
            password,
            role: 'seller',
          } as CreateUserDto);
      }
    });
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
