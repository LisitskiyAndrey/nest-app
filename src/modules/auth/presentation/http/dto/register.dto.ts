import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class RegisterDto {
  @ApiProperty({ example: 'alice@example.com' })
  @IsEmail()
  email: string

  @ApiProperty({ example: 'Alice', maxLength: 100 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string

  @ApiProperty({ example: 'secret123', minLength: 8 })
  @IsString()
  @MinLength(8)
  password: string
}
