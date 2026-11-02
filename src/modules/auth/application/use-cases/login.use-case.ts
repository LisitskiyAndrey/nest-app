import type { AuthResult } from '@/modules/auth/application/auth.types'
import type { PasswordHasherPort } from '@/modules/auth/application/ports/password-hasher-port'
import { AuthSessionService } from '@/modules/auth/application/services/auth-session.service'
import { InvalidCredentialsError } from '@/modules/auth/domain/errors/invalid-credentials.error'
import { PASSWORD_HASHER_PORT } from '@/modules/auth/tokens/password-hasher.tokens'
import type { UserRepository } from '@/modules/users/domain/repositories/user.repository'
import { USER_REPOSITORY } from '@/modules/users/users.tokens'
import { Inject, Injectable } from '@nestjs/common'

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(PASSWORD_HASHER_PORT)
    private readonly passwordHasher: PasswordHasherPort,
    private readonly authSessionService: AuthSessionService,
  ) {}

  async execute(email: string, password: string): Promise<AuthResult> {
    const user = await this.userRepository.findByEmail(email)
    if (!user || !user.passwordHash) {
      throw new InvalidCredentialsError()
    }

    const isValid = await this.passwordHasher.verify(user.passwordHash, password)

    if (!isValid) {
      throw new InvalidCredentialsError()
    }

    return this.authSessionService.createAuthSession(user)
  }
}
