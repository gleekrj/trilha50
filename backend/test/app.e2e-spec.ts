import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { Prisma } from '../src/generated/prisma/client';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';

describe('Aplicação (e2e)', () => {
  let app: INestApplication;
  let prismaMock: {
    user: {
      create: jest.Mock;
      findMany: jest.Mock;
      findUnique: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
  };

  beforeEach(async () => {
    prismaMock = {
      user: {
        create: jest.fn(),
        findMany: jest.fn().mockResolvedValue([]),
        findUnique: jest.fn().mockResolvedValue(null),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const prismaServiceMock = {
      onModuleInit: async () => {},
      onModuleDestroy: async () => {},
      $connect: async () => {},
      $disconnect: async () => {},
      user: prismaMock.user,
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prismaServiceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('GET /health retorna status ok', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual({ status: 'ok' });
      });
  });

  it('GET /admin/test — smoke (raiz)', () => {
    return request(app.getHttpServer())
      .get('/admin/test')
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual({ status: 'ok' });
      });
  });

  it('GET /users/admin/test — smoke (módulo users)', () => {
    return request(app.getHttpServer())
      .get('/users/admin/test')
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual({ status: 'ok' });
      });
  });

  describe('POST /users', () => {
    it('rejeita nome com caracteres inválidos', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send({
          name: 'João1',
          email: 'a@b.co',
          password: 'secret12',
        })
        .expect(400);
    });

    it('rejeita senha curta', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send({
          name: 'Maria',
          email: 'a@b.co',
          password: '12345',
        })
        .expect(400);
    });

    it('cria usuário e não retorna senha nem hash', async () => {
      const now = new Date();
      prismaMock.user.create.mockResolvedValue({
        id: '550e8400-e29b-41d4-a716-446655440000',
        email: 'pro@exemplo.com',
        name: 'Maria Silva',
        passwordHash: '$2b$12$hashed',
        createdAt: now,
        updatedAt: now,
      });

      const res = await request(app.getHttpServer())
        .post('/users')
        .send({
          name: 'Maria  Silva',
          email: 'pro@exemplo.com',
          password: 'secret12',
        })
        .expect(201);

      expect(res.body).toEqual({
        id: '550e8400-e29b-41d4-a716-446655440000',
        email: 'pro@exemplo.com',
        name: 'Maria Silva',
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      });
      expect(res.body.password).toBeUndefined();
      expect(res.body.passwordHash).toBeUndefined();

      expect(prismaMock.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          email: 'pro@exemplo.com',
          name: 'Maria Silva',
          passwordHash: expect.stringMatching(/^\$2[aby]\$/),
        }),
      });
    });

    it('retorna 409 quando o e-mail já existe', async () => {
      prismaMock.user.create.mockRejectedValue(
        new Prisma.PrismaClientKnownRequestError('Unique constraint', {
          code: 'P2002',
          clientVersion: 'test',
        }),
      );

      await request(app.getHttpServer())
        .post('/users')
        .send({
          name: 'Ana',
          email: 'dup@exemplo.com',
          password: 'secret12',
        })
        .expect(409);
    });
  });
});
