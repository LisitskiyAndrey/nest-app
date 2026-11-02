import { ErrorResponseDto } from '@/app/errors/error-response.dto'
import type { AuthResult, JwtPayload } from '@/modules/auth/application/auth.types'
import { GetCurrentUserUseCase } from '@/modules/auth/application/use-cases/get-current-user.use-case'
import { LoginUseCase } from '@/modules/auth/application/use-cases/login.use-case'
import { LogoutUseCase } from '@/modules/auth/application/use-cases/logout.use-case'
import { RefreshTokenUseCase } from '@/modules/auth/application/use-cases/refresh-token.use-case'
import { RegisterUseCase } from '@/modules/auth/application/use-cases/register.use-case'
import { JwtAuthGuard } from '@/modules/auth/infrastructure/guards/jwt-auth.guard'
import { CurrentUser } from '@/modules/auth/presentation/http/decorators/current-user.decorator'
import { AuthResponseDto } from '@/modules/auth/presentation/http/dto/auth-response.dto'
import { LoginDto } from '@/modules/auth/presentation/http/dto/login.dto'
import { RegisterDto } from '@/modules/auth/presentation/http/dto/register.dto'
import { UserResponseDto } from '@/modules/users/presentation/http/dto/user-response.dto'
import { UserPresenter } from '@/modules/users/presentation/http/presenters/user.presenter'
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import type { Response, Request } from 'express'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly getCurrentUserUseCase: GetCurrentUserUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterDto })
  @ApiCreatedResponse({ type: AuthResponseDto, description: 'User was created and authenticated.' })
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  async register(@Body() dto: RegisterDto) {
    return this.toAuthResponse(
      await this.registerUseCase.execute(dto.email, dto.name, dto.password),
    )
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ type: AuthResponseDto })
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.loginUseCase.execute(dto.email, dto.password)
    this.setRefreshTokenCookie(res, result.refreshToken)

    return this.toAuthResponse(result)
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete refresh session' })
  @ApiOkResponse({
    description: 'Refresh session was deleted.',
    schema: { example: null },
  })
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token = req.cookies['refreshToken']
    await this.logoutUseCase.execute(token)
    res.clearCookie('refreshToken', { path: '/auth/refresh' })
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user' })
  @ApiOkResponse({ type: UserResponseDto })
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  @UseGuards(JwtAuthGuard)
  async me(@CurrentUser() user: JwtPayload) {
    return UserPresenter.toResponse(await this.getCurrentUserUseCase.execute(user.sub))
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Rotate refresh token and issue a new access token' })
  @ApiOkResponse({ type: AuthResponseDto })
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token = req.cookies['refreshToken']
    const result = await this.refreshTokenUseCase.execute(token)
    this.setRefreshTokenCookie(res, result.refreshToken)

    return this.toAuthResponse(result)
  }

  private toAuthResponse(result: AuthResult) {
    return {
      accessToken: result.accessToken,
      user: UserPresenter.toResponse(result.user),
    }
  }

  private setRefreshTokenCookie(res: Response, token: string) {
    res.cookie('refreshToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/api/auth',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    })
  }
}
