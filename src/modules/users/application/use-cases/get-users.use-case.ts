import { Inject, Injectable } from '@nestjs/common'
import type { User } from '@users/domain/entities/user.entity'
import type { FindUsersOptions } from '@users/domain/repositories/user.repository'
import type { UserRepository } from '@users/domain/repositories/user.repository'
import { USER_REPOSITORY } from '@users/users.tokens'

@Injectable()
export class GetUsersUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(options: FindUsersOptions): Promise<User[]> {
    return this.userRepository.findAll(options)
  }
}
