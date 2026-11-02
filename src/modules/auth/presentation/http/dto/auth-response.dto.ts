import { UserResponseDto } from '@/modules/users/presentation/http/dto/user-response.dto'
import { ApiProperty } from '@nestjs/swagger'

export class AuthResponseDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJuser-id","email":"alice@example.com"}',
  })
  accessToken: string

  @ApiProperty({ type: UserResponseDto })
  user: UserResponseDto
}
