import { Inject, Injectable } from '@nestjs/common'
import { User } from '@users/domain/entities/user.entity'
import type { UserRepository } from '@users/domain/repositories/user.repository'
import { USER_REPOSITORY } from '@users/users.tokens'

@Injectable()
export class GetUsersUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(): Promise<User[]> {
    return this.userRepository.findAll()
  }
}
