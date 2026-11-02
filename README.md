# My Nest App

NestJS API with users, JWT authentication, refresh sessions, Prisma, and PostgreSQL.

## Requirements

- Node.js
- pnpm
- Docker, for local PostgreSQL

## Setup

```bash
pnpm install
cp .env.example .env
pnpm run db:up
pnpm prisma migrate deploy
pnpm run start:dev
```

The API starts on `http://localhost:3000` by default.

Swagger documentation is available at `http://localhost:3000/docs`.

## Environment

Required values:

- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`

Optional values:

- `PORT`, default `3000`
- `JWT_ACCESS_EXPIRES_IN`, default `15m`
- `JWT_REFRESH_EXPIRES_IN`, default `30d`
- `CORS_ORIGIN`, comma-separated allowed origins
- `THROTTLE_TTL_MS`, default `60000`
- `THROTTLE_LIMIT`, default `100`

## Scripts

```bash
pnpm run build
pnpm run lint
pnpm run format:check
pnpm run test
pnpm run test:e2e
pnpm run db:up
pnpm run db:down
```

## API

Auth:

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `GET /auth/me`, requires bearer access token

Users:

- `GET /users?limit=20&offset=0`, requires bearer access token
- `GET /users/:id`, requires bearer access token

Refresh tokens are stored as hashed refresh sessions. Calling `/auth/refresh` rotates the refresh token by deleting the old session and creating a new one.
