import { CreateUserUseCase } from '@/modules/users/application/use-cases/create-user.use-case';
import { GetUserByIdUseCase } from '@/modules/users/application/use-cases/get-user-by-id.use-case';
import { GetUsersUseCase } from '@/modules/users/application/use-cases/get-users.use-case';
import { PrismaUserRepository } from '@/modules/users/infrastructure/persistence/prisma-user.repository';
import { UsersController } from '@/modules/users/presentation/http/users.controller';
import { USER_REPOSITORY } from '@/modules/users/users.tokens';
import { PrismaModule } from '@/app/database/prisma.module';
import { Module } from '@nestjs/common';


@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: PrismaUserRepository,
    },
    CreateUserUseCase,
    GetUserByIdUseCase,
    GetUsersUseCase,
  ],
})
export class UsersModule {}
