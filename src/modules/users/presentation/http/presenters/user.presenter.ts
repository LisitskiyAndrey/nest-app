import type { User } from '@/modules/users/domain/entities/user.entity'

export interface UserResponse {
  id: string
  email: string
  name: string
  createdAt: Date
}

export class UserPresenter {
  static toResponse(user: User): UserResponse {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    }
  }
}
