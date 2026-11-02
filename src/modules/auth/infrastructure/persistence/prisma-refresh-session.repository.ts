import { PrismaService } from '@/app/database/prisma.service'
import { RefreshSession } from '@/modules/auth/domain/entities/refresh-session.entity'
import type { RefreshSessionRepository } from '@/modules/auth/domain/repositories/refresh-session.repository'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaRefreshSessionRepository implements RefreshSessionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(session: RefreshSession): Promise<RefreshSession> {
    const record = await this.prisma.refreshSession.create({
      data: {
        id: session.id,
        userId: session.userId,
        tokenHash: session.tokenHash,
        expiresAt: session.expiresAt,
        createdAt: session.createdAt,
      },
    })

    return new RefreshSession(
      record.id,
      record.userId,
      record.tokenHash,
      record.expiresAt,
      record.createdAt,
    )
  }

  async findById(id: string): Promise<RefreshSession | null> {
    const record = await this.prisma.refreshSession.findUnique({
      where: { id },
    })

    if (!record) {
      return null
    }

    return new RefreshSession(
      record.id,
      record.userId,
      record.tokenHash,
      record.expiresAt,
      record.createdAt,
    )
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await this.prisma.refreshSession.deleteMany({
      where: { id },
    })

    return result.count > 0
  }

  async deleteByUserId(userId: string): Promise<number> {
    const result = await this.prisma.refreshSession.deleteMany({
      where: { userId },
    })

    return result.count
  }
}
