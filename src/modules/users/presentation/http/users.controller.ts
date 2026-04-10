import { CreateUserUseCase } from '@/modules/users/application/use-cases/create-user.use-case'
import { GetUserByIdUseCase } from '@/modules/users/application/use-cases/get-user-by-id.use-case'
import { GetUsersUseCase } from '@/modules/users/application/use-cases/get-users.use-case'
import { User } from '@/modules/users/domain/entities/user.entity'
import { CreateUserDto } from '@/modules/users/presentation/http/dto/create-user.dto'
import { Body, Controller, Get, Param, Post } from '@nestjs/common'

@Controller('users')
export class UsersController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
    private readonly getUsersUseCase: GetUsersUseCase,
  ) {}

  @Post()
  create(@Body() dto: CreateUserDto): Promise<User> {
    return this.createUserUseCase.execute(dto.email, dto.name)
  }

  @Get()
  findAll(): Promise<User[]> {
    return this.getUsersUseCase.execute()
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<User> {
    return this.getUserByIdUseCase.execute(id)
  }
}
