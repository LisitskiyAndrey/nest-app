import type { User } from '@/modules/users/domain/entities/user.entity'
import type { PaginationOptions } from '@/shared/application/pagination-options'

export interface FindUsersOptions extends PaginationOptions {
  filters?: {
    email?: string
    name?: string
  }
}
export interface UserRepository {
  create(user: User): Promise<User>
  findById(id: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  findAll(options: FindUsersOptions): Promise<User[]>
}
