import type { JwtPayload, RefreshTokenPayload } from '@/modules/auth/application/auth.types'

export interface TokenProviderPort {
  createAccessToken(payload: JwtPayload): string
  createRefreshToken(payload: RefreshTokenPayload): string
  verifyRefreshToken(token: string): RefreshTokenPayload
}
