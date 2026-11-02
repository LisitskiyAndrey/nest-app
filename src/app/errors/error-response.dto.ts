import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class ErrorResponseDto {
  @ApiProperty({ example: 400 })
  statusCode: number

  @ApiProperty({ example: 'BAD_REQUEST' })
  code: string

  @ApiProperty({
    example: 'email must be an email, password must be longer than or equal to 8 characters',
  })
  message: string

  @ApiPropertyOptional({
    example: {
      errors: ['email must be an email', 'password must be longer than or equal to 8 characters'],
    },
  })
  details?: Record<string, unknown>

  @ApiProperty({ example: '2026-06-09T10:00:00.000Z' })
  timestamp: string

  @ApiProperty({ example: '/auth/register' })
  path: string
}
