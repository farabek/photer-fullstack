import { IsEmail, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'hashedPassword', required: false })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiProperty({ required: false, example: 'google' })
  @IsOptional()
  @IsString()
  oauthProvider?: string;

  @ApiProperty({ required: false, example: '123456789' })
  @IsOptional()
  @IsString()
  oauthId?: string;
}
