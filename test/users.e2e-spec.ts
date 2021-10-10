import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createTestingApp } from './__support__/create-testing.app';
import { CreateUserDto } from '../src/users/dto/create-user.dto';
import { Connection, In } from 'typeorm';
import { User, UserRole } from '../src/core/user.entity';
import { UpdateUserDto } from '../src/users/dto/update-user.dto';
import { registerUser } from './__support__/register-user';

const username = 'UsersController (e2e) new user';
const updatedUsername = 'UsersController (e2e) an updated username';
const createdUsername = 'UsersController (e2e) a new username';
const password = 'test1234!@£';

describe('UsersController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await createTestingApp();
    await app
      .get(Connection)
      .getRepository(User)
      .delete({ username: In([username, updatedUsername, createdUsername]) });
  });

  afterEach(async () => {
    await app.close();
  });

  let id: number;
  let token: string;
  beforeEach(async () => {
    const response = await registerUser(app, {
      username,
      password,
      role: UserRole.buyer,
    });
    id = response.id;
    token = response.token;
  });

  describe('CRUD for users', () => {
    describe('CREATE', () => {
      it('does not require authentication', async () => {
        const response = await request(app.getHttpServer())
          .post('/users')
          .set('Accept', 'application/json')
          .send({
            username: createdUsername,
            password,
            role: 'seller',
          } as CreateUserDto);

        expect(response.status).toEqual(201);
      });
    });
    describe('READ', () => {
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
    });
    describe('UPDATE', () => {
      it('allows a registered user to update their username', async () => {
        const updated = await request(app.getHttpServer())
          .patch(`/users/me`)
          .set('Authorization', `Bearer ${token}`)
          .send({ username: updatedUsername } as UpdateUserDto);

        expect(updated).toHaveProperty('status', 200);

        expect(
          await request(app.getHttpServer())
            .get('/users/me')
            .set('Authorization', `Bearer ${token}`),
        ).toHaveProperty('body.username', updatedUsername);
      });
      it('validates input', async () => {
        const updated = await request(app.getHttpServer())
          .patch('/users/me')
          .set('Authorization', `Bearer ${token}`)
          .send({ uusername: 'not a valid field' });

        expect(updated).toHaveProperty('status', 400);
        expect(JSON.stringify(updated.body.message)).toContain('uusername');
      });
    });
    describe('DELETE', () => {
      it('lets a user delete themselves', async () => {
        const deleted = await request(app.getHttpServer())
          .delete('/users/me')
          .set('Authorization', `Bearer ${token}`);

        expect(deleted).toHaveProperty('status', 200);

        expect(
          await request(app.getHttpServer())
            .get('/users/me')
            .set('Authorization', `Bearer ${token}`),
        ).toHaveProperty('status', 404);
      });
    });
  });
});
