import type { RefreshSession } from '@/modules/auth/domain/entities/refresh-session.entity'

export interface RefreshSessionRepository {
  create(session: RefreshSession): Promise<RefreshSession>
  findById(id: string): Promise<RefreshSession | null>
  deleteById(id: string): Promise<boolean>
  deleteByUserId(userId: string): Promise<number>
}
