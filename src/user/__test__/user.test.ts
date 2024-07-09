import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../app.module';

describe('auth end pint', () => {
  let app: INestApplication;
  let emailMock = 'someEmail@Example.com';
  let passwordMock = 'somePassword';
  let usernameMock = 'someUserName';
  let currentUserId;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('api/auth/sign-up', async () => {
    return request(app.getHttpServer())
      .post('/api/auth/sign-up')
      .send({
        email: emailMock,
        password: passwordMock,
        username: usernameMock,
      })
      .then((res) => {
        const { user_id, username, email } = res.body;
        currentUserId = user_id;
        expect(user_id).toBeTruthy();
        expect(username).toEqual(usernameMock);
        expect(email).toEqual(usernameMock);
      });
  });
});
