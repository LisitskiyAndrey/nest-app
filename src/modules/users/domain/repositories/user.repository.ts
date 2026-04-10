import type { User } from "@/modules/users/domain/entities/user.entity.ts"


export interface UserRepository {
  create(user: User): Promise<User>
  findById(id: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  findAll(): Promise<User[]>
}
