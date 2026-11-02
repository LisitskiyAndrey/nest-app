import { Inject, Injectable } from '@nestjs/common'
import { PASSWORD_HASHER_PORT } from '@/modules/auth/tokens/password-hasher.tokens'
import type { PasswordHasherPort } from '@/modules/auth/application/ports/password-hasher-port'
import { TOKEN_SERVICE_PORT } from '@/modules/auth/tokens/token-service.tokens'
import type { TokenProviderPort } from '@/modules/auth/application/ports/token-provider-port'
import { REFRESH_SESSION_REPOSITORY } from '@/modules/auth/tokens/refresh-session-repository.tokens'
import type { RefreshSessionRepository } from '@/modules/auth/domain/repositories/refresh-session.repository'
import { randomUUID } from 'crypto'
import { RefreshSession } from '@/modules/auth/domain/entities/refresh-session.entity'
import { ConfigService } from '@nestjs/config'
import { getRefreshSessionTtlMs } from '@/modules/auth/auth.config'
import type { AuthResult } from '@/modules/auth/application/auth.types'
import type { User } from '@/modules/users/domain/entities/user.entity'

@Injectable()
export class AuthSessionService {
  constructor(
    @Inject(PASSWORD_HASHER_PORT)
    private readonly passwordHasher: PasswordHasherPort,
    @Inject(TOKEN_SERVICE_PORT)
    private readonly tokenService: TokenProviderPort,
    @Inject(REFRESH_SESSION_REPOSITORY)
    private readonly refreshSessionRepository: RefreshSessionRepository,

    private readonly configService: ConfigService,
  ) {}

  async createAuthSession(user: User): Promise<AuthResult> {
    const refreshSessionTtlMs = getRefreshSessionTtlMs(this.configService)

    const sessionId = randomUUID()
    const accessToken = this.tokenService.createAccessToken({ sub: user.id, email: user.email })
    const refreshToken = this.tokenService.createRefreshToken({
      sessionId,
      sub: user.id,
      email: user.email,
    })
    const refreshTokenHash = await this.passwordHasher.hash(refreshToken)

    await this.refreshSessionRepository.create(
      new RefreshSession(
        sessionId,
        user.id,
        refreshTokenHash,
        new Date(Date.now() + refreshSessionTtlMs),
        new Date(),
      ),
    )

    return { accessToken, refreshToken, user }
  }
}
