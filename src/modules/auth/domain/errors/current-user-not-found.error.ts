import { AppError } from '@/app/errors/app-error'
import { AUTH_ERROR_CODES } from '@/modules/auth/domain/errors/auth-error-codes'
import { HttpStatus } from '@nestjs/common'

export class CurrentUserNotFoundError extends AppError {
  constructor() {
    super('User no longer exists', {
      code: AUTH_ERROR_CODES.currentUserNotFound,
      statusCode: HttpStatus.UNAUTHORIZED,
    })
  }
}
