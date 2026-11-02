import type { TokenProviderPort } from '@/modules/auth/application/ports/token-provider-port'
import type { RefreshSessionRepository } from '@/modules/auth/domain/repositories/refresh-session.repository'
import { REFRESH_SESSION_REPOSITORY } from '@/modules/auth/tokens/refresh-session-repository.tokens'
import { TOKEN_SERVICE_PORT } from '@/modules/auth/tokens/token-service.tokens'
import { Inject, Injectable } from '@nestjs/common'

@Injectable()
export class LogoutUseCase {
  constructor(
    @Inject(TOKEN_SERVICE_PORT)
    private readonly tokenService: TokenProviderPort,
    @Inject(REFRESH_SESSION_REPOSITORY)
    private readonly refreshSessionRepository: RefreshSessionRepository,
  ) {}

  async execute(refreshToken: string): Promise<void> {
    const payload = this.tokenService.verifyRefreshToken(refreshToken)
    await this.refreshSessionRepository.deleteById(payload.sessionId)
  }
}
