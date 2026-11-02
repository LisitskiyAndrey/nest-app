import { ErrorResponseDto } from '@/app/errors/error-response.dto'
import { JwtAuthGuard } from '@/modules/auth/infrastructure/guards/jwt-auth.guard'
import { GetUserByIdUseCase } from '@/modules/users/application/use-cases/get-user-by-id.use-case'
import { GetUsersUseCase } from '@/modules/users/application/use-cases/get-users.use-case'
import { GetUsersQueryDto } from '@/modules/users/presentation/http/dto/get-users-query.dto'
import { UserResponseDto } from '@/modules/users/presentation/http/dto/user-response.dto'
import { UsersListResponseDto } from '@/modules/users/presentation/http/dto/users-list-response.dto'
import {
  UserPresenter,
  UserResponse,
} from '@/modules/users/presentation/http/presenters/user.presenter'
import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'

export interface UsersListResponse {
  data: UserResponse[]
  pagination: {
    limit: number
    offset: number
  }
}

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
    private readonly getUsersUseCase: GetUsersUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List users' })
  @ApiOkResponse({ type: UsersListResponseDto })
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  async findAll(@Query() query: GetUsersQueryDto): Promise<UsersListResponse> {
    const users = await this.getUsersUseCase.execute({
      limit: query.limit,
      offset: query.offset,
      filters: {
        email: query.email,
        name: query.name,
      },
    })

    return {
      data: users.map(UserPresenter.toResponse),
      pagination: {
        limit: query.limit,
        offset: query.offset,
      },
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiParam({
    name: 'id',
    example: '4f82f0af-7e78-4c4f-b675-2efdc86e0ad1',
  })
  @ApiOkResponse({ type: UserResponseDto })
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  @ApiNotFoundResponse({ type: ErrorResponseDto })
  async findById(@Param('id') id: string): Promise<UserResponse> {
    const user = await this.getUserByIdUseCase.execute(id)
    return UserPresenter.toResponse(user)
  }
}
