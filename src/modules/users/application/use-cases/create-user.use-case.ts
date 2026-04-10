import { User } from '@/modules/users/domain/entities/user.entity'
import type { UserRepository } from '@/modules/users/domain/repositories/user.repository'
import { USER_REPOSITORY } from '@/modules/users/users.tokens'

import { ConflictException, Inject, Injectable } from '@nestjs/common'
import { randomUUID } from 'crypto'

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(email: string, name: string): Promise<User> {
    const existing = await this.userRepository.findByEmail(email)

    if (existing) {
      throw new ConflictException(`A user with email "${email}" already exists`)
    }

    const user = new User(randomUUID(), email, name, new Date())

    return this.userRepository.create(user)
  }
}
