import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createTestingApp } from './__support__/create-testing.app';
import { CreateUserDto } from '../src/users/create-user.dto';

describe('UsersController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await createTestingApp();
  });

  describe('/users (POST)', () => {
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
