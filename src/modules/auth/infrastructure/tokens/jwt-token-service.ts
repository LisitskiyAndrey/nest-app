import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'

import { getAccessTokenConfig, getRefreshTokenConfig } from '@/modules/auth/auth.config'
import type { JwtPayload, RefreshTokenPayload } from '@/modules/auth/application/auth.types'
import type { TokenProviderPort } from '@/modules/auth/application/ports/token-provider-port'

@Injectable()
export class JwtTokenService implements TokenProviderPort {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  createAccessToken(payload: JwtPayload): string {
    const config = getAccessTokenConfig(this.configService)

    return this.jwtService.sign(payload, {
      secret: config.secret,
      expiresIn: config.expiresIn,
    })
  }

  createRefreshToken(payload: RefreshTokenPayload): string {
    const config = getRefreshTokenConfig(this.configService)

    return this.jwtService.sign(payload, {
      secret: config.secret,
      expiresIn: config.expiresIn,
    })
  }

  verifyRefreshToken(token: string): RefreshTokenPayload {
    const config = getRefreshTokenConfig(this.configService)

    return this.jwtService.verify<RefreshTokenPayload>(token, {
      secret: config.secret,
    })
  }
}
