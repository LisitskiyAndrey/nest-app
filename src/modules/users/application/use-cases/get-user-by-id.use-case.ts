import { UserNotFoundError } from '@/modules/users/domain/errors/user-not-found.error'
import { Inject, Injectable } from '@nestjs/common'
import { User } from '@users/domain/entities/user.entity'
import type { UserRepository } from '@users/domain/repositories/user.repository'
import { USER_REPOSITORY } from '@users/users.tokens'

@Injectable()
export class GetUserByIdUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(id: string): Promise<User> {
    const user = await this.userRepository.findById(id)

    if (!user) {
      throw new UserNotFoundError(id)
    }

    return user
  }
}
