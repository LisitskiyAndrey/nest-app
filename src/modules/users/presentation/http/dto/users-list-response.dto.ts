import { ApiProperty } from '@nestjs/swagger'
import { UserResponseDto } from './user-response.dto'

class UsersPaginationDto {
  @ApiProperty({ example: 20 })
  limit: number

  @ApiProperty({ example: 0 })
  offset: number
}

export class UsersListResponseDto {
  @ApiProperty({ type: [UserResponseDto] })
  data: UserResponseDto[]

  @ApiProperty({ type: UsersPaginationDto })
  pagination: UsersPaginationDto
}
