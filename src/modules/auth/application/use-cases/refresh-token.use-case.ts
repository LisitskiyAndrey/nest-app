import type { AuthResult } from '@/modules/auth/application/auth.types'
import type { PasswordHasherPort } from '@/modules/auth/application/ports/password-hasher-port'
import type { TokenProviderPort } from '@/modules/auth/application/ports/token-provider-port'
import { AuthSessionService } from '@/modules/auth/application/services/auth-session.service'
import { InvalidCredentialsError } from '@/modules/auth/domain/errors/invalid-credentials.error'
import type { RefreshSessionRepository } from '@/modules/auth/domain/repositories/refresh-session.repository'
import { PASSWORD_HASHER_PORT } from '@/modules/auth/tokens/password-hasher.tokens'
import { REFRESH_SESSION_REPOSITORY } from '@/modules/auth/tokens/refresh-session-repository.tokens'
import { TOKEN_SERVICE_PORT } from '@/modules/auth/tokens/token-service.tokens'
import type { UserRepository } from '@/modules/users/domain/repositories/user.repository'
import { USER_REPOSITORY } from '@/modules/users/users.tokens'
import { Inject, Injectable } from '@nestjs/common'

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    @Inject(TOKEN_SERVICE_PORT)
    private readonly tokenService: TokenProviderPort,
    @Inject(PASSWORD_HASHER_PORT)
    private readonly passwordHasher: PasswordHasherPort,
    @Inject(REFRESH_SESSION_REPOSITORY)
    private readonly refreshSessionRepository: RefreshSessionRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    private readonly authSessionService: AuthSessionService,
  ) {}

  async execute(refreshToken: string): Promise<AuthResult> {
    const payload = this.tokenService.verifyRefreshToken(refreshToken)

    const session = await this.refreshSessionRepository.findById(payload.sessionId)

    if (!session) {
      throw new InvalidCredentialsError()
    }

    if (session.expiresAt.getTime() <= Date.now()) {
      throw new InvalidCredentialsError()
    }

    const isValid = await this.passwordHasher.verify(session.tokenHash, refreshToken)

    if (!isValid) {
      throw new InvalidCredentialsError()
    }

    const user = await this.userRepository.findById(session.userId)

    if (!user) {
      throw new InvalidCredentialsError()
    }

    await this.refreshSessionRepository.deleteById(session.id)

    return this.authSessionService.createAuthSession(user)
  }
}
