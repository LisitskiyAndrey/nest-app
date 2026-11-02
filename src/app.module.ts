import { validateEnv } from '@/app/config/env.validation'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { PrismaModule } from '@/app/database/prisma.module'
import { AuthModule } from '@/modules/auth/auth.module'
import { UsersModule } from '@/modules/users/users.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validateEnv }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [
        {
          ttl: configService.getOrThrow<number>('THROTTLE_TTL_MS'),
          limit: configService.getOrThrow<number>('THROTTLE_LIMIT'),
        },
      ],
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
