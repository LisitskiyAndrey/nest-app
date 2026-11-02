import { ApiProperty } from '@nestjs/swagger'

export class UserResponseDto {
  @ApiProperty({ example: '4f82f0af-7e78-4c4f-b675-2efdc86e0ad1' })
  id: string

  @ApiProperty({ example: 'alice@example.com' })
  email: string

  @ApiProperty({ example: 'Alice' })
  name: string

  @ApiProperty({ example: '2026-06-09T10:00:00.000Z' })
  createdAt: Date
}
