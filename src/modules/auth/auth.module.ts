import { PrismaModule } from '@/app/database/prisma.module'
import { GetCurrentUserUseCase } from '@/modules/auth/application/use-cases/get-current-user.use-case'
import { LoginUseCase } from '@/modules/auth/application/use-cases/login.use-case'
import { RegisterUseCase } from '@/modules/auth/application/use-cases/register.use-case'
import { PrismaRefreshSessionRepository } from '@/modules/auth/infrastructure/persistence/prisma-refresh-session.repository'
import { JwtStrategy } from '@/modules/auth/infrastructure/strategies/jwt.strategy'
import { JwtTokenService } from '@/modules/auth/infrastructure/tokens/jwt-token-service'
import { AuthController } from '@/modules/auth/presentation/http/auth.controller'
import { UsersModule } from '@/modules/users/users.module'
import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { Argon2PasswordHasher } from '@/modules/auth/infrastructure/security/argon2-password-hasher'
import { PASSWORD_HASHER_PORT } from '@/modules/auth/tokens/password-hasher.tokens'
import { REFRESH_SESSION_REPOSITORY } from '@/modules/auth/tokens/refresh-session-repository.tokens'
import { TOKEN_SERVICE_PORT } from '@/modules/auth/tokens/token-service.tokens'
import { LogoutUseCase } from '@/modules/auth/application/use-cases/logout.use-case'
import { RefreshTokenUseCase } from '@/modules/auth/application/use-cases/refresh-token.use-case'
import { AuthSessionService } from '@/modules/auth/application/services/auth-session.service'

@Module({
  imports: [PrismaModule, UsersModule, PassportModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    GetCurrentUserUseCase,
    JwtStrategy,
    LoginUseCase,
    LogoutUseCase,
    RefreshTokenUseCase,
    RegisterUseCase,
    AuthSessionService,
    {
      provide: PASSWORD_HASHER_PORT,
      useClass: Argon2PasswordHasher,
    },
    {
      provide: REFRESH_SESSION_REPOSITORY,
      useClass: PrismaRefreshSessionRepository,
    },
    {
      provide: TOKEN_SERVICE_PORT,
      useClass: JwtTokenService,
    },
  ],
})
export class AuthModule {}
