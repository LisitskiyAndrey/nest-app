import { AppExceptionFilter } from '@/app/errors/app-exception.filter'
import { Logger, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import type { NextFunction, Request, Response } from 'express'
import helmet from 'helmet'
import { AppModule } from './app.module'
import cookieParser from 'cookie-parser'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService)
  const logger = new Logger('HTTP')
  app.use(cookieParser())

  app.use(helmet())
  app.enableCors({
    origin: getCorsOrigin(configService.get<string>('CORS_ORIGIN')),
    credentials: true,
  })
  app.enableShutdownHooks()

  app.use((req: Request, res: Response, next: NextFunction) => {
    const startedAt = Date.now()

    res.on('finish', () => {
      const durationMs = Date.now() - startedAt
      logger.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${durationMs}ms`)
    })

    next()
  })

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )
  app.useGlobalFilters(new AppExceptionFilter())

  const swaggerConfig = new DocumentBuilder()
    .setTitle('My Nest App API')
    .setDescription('Users and authentication API')
    .setVersion('1.0')
    .addBearerAuth()
    .build()
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('docs', app, swaggerDocument)

  await app.listen(configService.getOrThrow<number>('PORT'))
}

function getCorsOrigin(value?: string): boolean | string[] {
  if (!value) {
    return false
  }

  if (value === '*') {
    return true
  }

  return value.split(',').map((origin) => origin.trim())
}

bootstrap()
