import { AppError } from '@/app/errors/app-error'
import { Prisma } from '@/generated/prisma/client'
import { HttpStatus } from '@nestjs/common'

const SYSTEM_ERROR_CODES = {
  databaseError: 'SYSTEM_DATABASE_ERROR',
  uniqueConstraint: 'SYSTEM_UNIQUE_CONSTRAINT',
  internalError: 'SYSTEM_INTERNAL_ERROR',
} as const

export function mapSystemError(error: unknown): AppError {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      return new AppError('Unique constraint violation', {
        code: SYSTEM_ERROR_CODES.uniqueConstraint,
        statusCode: HttpStatus.CONFLICT,
        cause: error,
      })
    }

    return new AppError('Database request failed', {
      code: SYSTEM_ERROR_CODES.databaseError,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      cause: error,
    })
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    return new AppError('Database connection failed', {
      code: SYSTEM_ERROR_CODES.databaseError,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      cause: error,
    })
  }

  if (error instanceof Error) {
    return new AppError('Internal server error', {
      code: SYSTEM_ERROR_CODES.internalError,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      cause: error,
    })
  }

  return new AppError('Internal server error', {
    code: SYSTEM_ERROR_CODES.internalError,
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    details: { value: String(error) },
  })
}
