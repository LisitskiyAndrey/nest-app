import { AppError } from '@/app/errors/app-error'
import { USERS_ERROR_CODES } from '@/modules/users/domain/errors/users-error-codes'
import { HttpStatus } from '@nestjs/common'

export class UserNotFoundError extends AppError {
  constructor(id: string) {
    super(`User with id "${id}" was not found`, {
      code: USERS_ERROR_CODES.userNotFound,
      statusCode: HttpStatus.NOT_FOUND,
      details: { id },
    })
  }
}
