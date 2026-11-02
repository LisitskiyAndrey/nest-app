import { AppExceptionFilter } from '@/app/errors/app-exception.filter'
import { PrismaService } from '@/app/database/prisma.service'
import { AppModule } from '@/app.module'
import { ValidationPipe } from '@nestjs/common'
import type { INestApplication } from '@nestjs/common'
import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import * as argon2 from 'argon2'
import request from 'supertest'

type UserRecord = {
  id: string
  email: string
  name: string
  passwordHash: string
  createdAt: Date
}

type RefreshSessionRecord = {
  id: string
  userId: string
  tokenHash: string
  expiresAt: Date
  createdAt: Date
}

describe('Auth (e2e)', () => {
  let app: INestApplication
  let moduleFixture: TestingModule
  let users: UserRecord[]
  let refreshSessions: RefreshSessionRecord[]

  beforeEach(async () => {
    process.env.DATABASE_URL = 'postgresql://postgres:postgres@localhost:5432/my_nest_app'
    process.env.JWT_SECRET = 'test-secret'
    process.env.JWT_ACCESS_SECRET = 'test-access-secret'
    process.env.JWT_REFRESH_SECRET = 'test-refresh-secret'
    process.env.THROTTLE_TTL_MS = '60000'
    process.env.THROTTLE_LIMIT = '1000'

    users = []
    refreshSessions = []

    const prismaMock = {
      refreshSession: {
        create: async ({ data }: { data: RefreshSessionRecord }) => {
          const record = { ...data }
          refreshSessions.push(record)
          return record
        },
        findUnique: async ({ where }: { where: { id: string } }) =>
          refreshSessions.find((session) => session.id === where.id) ?? null,
        deleteMany: async ({ where }: { where: { id?: string; userId?: string } }) => {
          const before = refreshSessions.length
          refreshSessions = refreshSessions.filter((session) => {
            if (where.id) {
              return session.id !== where.id
            }

            if (where.userId) {
              return session.userId !== where.userId
            }

            return true
          })

          return { count: before - refreshSessions.length }
        },
      },
      user: {
        create: async ({ data }: { data: UserRecord }) => {
          const record = { ...data }
          users.push(record)
          return record
        },
        findUnique: async ({ where }: { where: { id?: string; email?: string } }) => {
          if (where.id) {
            return users.find((user) => user.id === where.id) ?? null
          }

          if (where.email) {
            return users.find((user) => user.email === where.email) ?? null
          }

          return null
        },
        findMany: async ({ skip, take }: { skip: number; take: number }) =>
          [...users]
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            .slice(skip, skip + take),
      },
    }

    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prismaMock)
      .compile()

    app = moduleFixture.createNestApplication()
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    )
    app.useGlobalFilters(new AppExceptionFilter())
    await app.init()
  })

  it('registers a user over HTTP and does not expose passwordHash', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'alice@example.com',
        name: 'Alice',
        password: 'secret123',
      })
      .expect(201)

    expect(response.body.accessToken).toEqual(expect.any(String))
    expect(response.body.refreshToken).toEqual(expect.any(String))
    expect(response.body.user).toMatchObject({
      email: 'alice@example.com',
      name: 'Alice',
    })
    expect(response.body.user.passwordHash).toBeUndefined()

    expect(users).toHaveLength(1)
    await expect(argon2.verify(users[0].passwordHash, 'secret123')).resolves.toBe(true)
  })

  it('rejects invalid HTTP payloads with a normalized 400 response', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'not-email',
        name: 'Alice',
        password: 'short',
      })
      .expect(400)

    expect(response.body).toMatchObject({
      statusCode: 400,
      code: 'BAD_REQUEST',
      path: '/auth/register',
    })
  })

  it('rotates refresh tokens over HTTP', async () => {
    const registerResponse = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'alice@example.com',
        name: 'Alice',
        password: 'secret123',
      })
      .expect(201)

    const refreshResponse = await request(app.getHttpServer())
      .post('/auth/refresh')
      .send({ refreshToken: registerResponse.body.refreshToken })
      .expect(200)

    expect(refreshResponse.body.refreshToken).toEqual(expect.any(String))
    expect(refreshResponse.body.refreshToken).not.toBe(registerResponse.body.refreshToken)
    expect(refreshSessions).toHaveLength(1)
  })

  it('protects users routes with bearer auth', async () => {
    await request(app.getHttpServer()).get('/users').expect(401)
  })

  afterEach(async () => {
    await app.close()
    await moduleFixture.close()
  })
})
