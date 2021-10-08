import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
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
