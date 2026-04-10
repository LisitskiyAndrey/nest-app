import { PrismaService } from "@/app/database/prisma.service";
import { User } from "@/modules/users/domain/entities/user.entity";
import type { UserRepository } from "@/modules/users/domain/repositories/user.repository";
import { Injectable } from "@nestjs/common";


@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: { email: string; name: string }): Promise<User> {
    const record = await this.prisma.user.create({ data })

    return new User(record.id, record.email, record.name, record.createdAt)
  }

  async findById(id: string): Promise<User | null> {
    const record = await this.prisma.user.findUnique({ where: { id } })
    if (!record) return null

    return new User(record.id, record.email, record.name, record.createdAt)
  }

  async findByEmail(email: string): Promise<User | null> {
    const record = await this.prisma.user.findUnique({ where: { email } })
    if (!record) return null

    return new User(record.id, record.email, record.name, record.createdAt)
  }

  async findAll(): Promise<User[]> {
    const records = await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return records.map((r) => new User(r.id, r.email, r.name, r.createdAt))
  }
}
