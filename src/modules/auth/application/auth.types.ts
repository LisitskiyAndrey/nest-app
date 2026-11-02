import type { User } from '@/modules/users/domain/entities/user.entity'

export interface AuthResult {
  user: User
  accessToken: string
  refreshToken: string
}

export interface JwtPayload {
  sub: string
  email: string
}

export interface RefreshTokenPayload extends JwtPayload {
  sessionId: string
}
