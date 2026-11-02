import { AppError } from '@/app/errors/app-error'
import { AUTH_ERROR_CODES } from '@/modules/auth/domain/errors/auth-error-codes'
import { HttpStatus } from '@nestjs/common'

export class InvalidCredentialsError extends AppError {
  constructor() {
    super('Invalid credentials', {
      code: AUTH_ERROR_CODES.invalidCredentials,
      statusCode: HttpStatus.UNAUTHORIZED,
    })
  }
}
