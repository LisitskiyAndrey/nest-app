import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

import { getAccessTokenConfig } from '@/modules/auth/auth.config'
import type { JwtPayload } from '@/modules/auth/application/auth.types'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    const config = getAccessTokenConfig(configService)

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.secret,
    })
  }

  validate(payload: JwtPayload): JwtPayload {
    if (!payload.sub) {
      throw new UnauthorizedException()
    }

    return payload
  }
}
