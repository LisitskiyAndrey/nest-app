import { User } from '@/modules/users/domain/entities/user.entity'
import { UserAlreadyExistsError } from '@/modules/users/domain/errors/user-already-exists.error'
import type { UserRepository } from '@/modules/users/domain/repositories/user.repository'
import { USER_REPOSITORY } from '@/modules/users/users.tokens'

import { Inject, Injectable } from '@nestjs/common'
import { randomUUID } from 'crypto'

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(email: string, name: string, passwordHash: string): Promise<User> {
    const existing = await this.userRepository.findByEmail(email)
    if (existing) {
      throw new UserAlreadyExistsError(email)
    }

    const user = new User(randomUUID(), email, name, passwordHash, new Date())

    return this.userRepository.create(user)
  }
}
