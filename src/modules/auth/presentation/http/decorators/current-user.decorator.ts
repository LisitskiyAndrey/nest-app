import type { JwtPayload } from '@/modules/auth/application/auth.types'
import type { ExecutionContext } from '@nestjs/common'
import { createParamDecorator } from '@nestjs/common'
import type { Request } from 'express'

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): JwtPayload => {
    const request = ctx.switchToHttp().getRequest<Request & { user: JwtPayload }>()
    return request.user
  },
)
