import type { PasswordHasherPort } from '@/modules/auth/application/ports/password-hasher-port'
import type { TokenProviderPort } from '@/modules/auth/application/ports/token-provider-port'
import type { AuthSessionService } from '@/modules/auth/application/services/auth-session.service'
import { RefreshTokenUseCase } from '@/modules/auth/application/use-cases/refresh-token.use-case'
import { InvalidCredentialsError } from '@/modules/auth/domain/errors/invalid-credentials.error'
import { RefreshSession } from '@/modules/auth/domain/entities/refresh-session.entity'
import type { RefreshSessionRepository } from '@/modules/auth/domain/repositories/refresh-session.repository'
import { User } from '@/modules/users/domain/entities/user.entity'
import type { UserRepository } from '@/modules/users/domain/repositories/user.repository'

describe('RefreshTokenUseCase', () => {
  const user = new User('user-id', 'alice@example.com', 'Alice', 'hash', new Date('2026-01-01'))
  const session = new RefreshSession(
    'session-id',
    user.id,
    'refresh-token-hash',
    new Date(Date.now() + 60_000),
    new Date('2026-01-01'),
  )

  it('rotates a valid refresh token by deleting the old session and creating a new one', async () => {
    const refreshSessionRepository = {
      findById: jest.fn().mockResolvedValue(session),
      deleteById: jest.fn().mockResolvedValue(true),
    } as unknown as RefreshSessionRepository
    const userRepository = {
      findById: jest.fn().mockResolvedValue(user),
    } as unknown as UserRepository
    const authSession = {
      createAuthSession: jest.fn().mockResolvedValue({
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
        user,
      }),
    } as unknown as AuthSessionService

    const useCase = new RefreshTokenUseCase(
      {
        verifyRefreshToken: jest.fn().mockReturnValue({ sessionId: session.id }),
      } as unknown as TokenProviderPort,
      { verify: jest.fn().mockResolvedValue(true) } as unknown as PasswordHasherPort,
      refreshSessionRepository,
      userRepository,
      authSession,
    )

    const result = await useCase.execute('old-refresh-token')

    expect(refreshSessionRepository.deleteById).toHaveBeenCalledWith(session.id)
    expect(authSession.createAuthSession).toHaveBeenCalledWith(user)
    expect(result.refreshToken).toBe('new-refresh-token')
  })

  it('rejects missing sessions', async () => {
    const useCase = new RefreshTokenUseCase(
      {
        verifyRefreshToken: jest.fn().mockReturnValue({ sessionId: session.id }),
      } as unknown as TokenProviderPort,
      { verify: jest.fn() } as unknown as PasswordHasherPort,
      { findById: jest.fn().mockResolvedValue(null) } as unknown as RefreshSessionRepository,
      { findById: jest.fn() } as unknown as UserRepository,
      { createAuthSession: jest.fn() } as unknown as AuthSessionService,
    )

    await expect(useCase.execute('refresh-token')).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
