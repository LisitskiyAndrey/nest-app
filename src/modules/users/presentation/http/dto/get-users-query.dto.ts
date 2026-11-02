import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { PaginationQueryDto } from '@/shared/presentation/dto/pagination-query.dto'

export class GetUsersQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ example: 'alice@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string

  @ApiPropertyOptional({ example: 'ali' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string
}
