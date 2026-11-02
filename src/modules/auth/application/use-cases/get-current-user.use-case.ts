import { CurrentUserNotFoundError } from '@/modules/auth/domain/errors/current-user-not-found.error'
import type { User } from '@/modules/users/domain/entities/user.entity'
import type { UserRepository } from '@/modules/users/domain/repositories/user.repository'
import { USER_REPOSITORY } from '@/modules/users/users.tokens'
import { Inject, Injectable } from '@nestjs/common'

@Injectable()
export class GetCurrentUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(userId: string): Promise<User> {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      throw new CurrentUserNotFoundError()
    }

    return user
  }
}
