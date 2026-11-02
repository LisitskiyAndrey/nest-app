import type { AuthResult } from '@/modules/auth/application/auth.types'
import type { PasswordHasherPort } from '@/modules/auth/application/ports/password-hasher-port'
import { AuthSessionService } from '@/modules/auth/application/services/auth-session.service'
import { PASSWORD_HASHER_PORT } from '@/modules/auth/tokens/password-hasher.tokens'
import { CreateUserUseCase } from '@/modules/users/application/use-cases/create-user.use-case'
import { Inject, Injectable } from '@nestjs/common'

@Injectable()
export class RegisterUseCase {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    @Inject(PASSWORD_HASHER_PORT)
    private readonly passwordHasher: PasswordHasherPort,

    private readonly authSessionService: AuthSessionService,
  ) {}

  async execute(email: string, name: string, password: string): Promise<AuthResult> {
    const passwordHash = await this.passwordHasher.hash(password)
    const user = await this.createUserUseCase.execute(email, name, passwordHash)

    return this.authSessionService.createAuthSession(user)
  }
}
