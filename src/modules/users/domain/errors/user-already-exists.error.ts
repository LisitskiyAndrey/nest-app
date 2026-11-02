import { AppError } from '@/app/errors/app-error'
import { USERS_ERROR_CODES } from '@/modules/users/domain/errors/users-error-codes'
import { HttpStatus } from '@nestjs/common'

export class UserAlreadyExistsError extends AppError {
  constructor(email: string) {
    super(`A user with email "${email}" already exists`, {
      code: USERS_ERROR_CODES.userAlreadyExists,
      statusCode: HttpStatus.CONFLICT,
      details: { email },
    })
  }
}
