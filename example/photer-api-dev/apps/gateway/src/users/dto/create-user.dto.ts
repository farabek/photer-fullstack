import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsOptional,
  IsBoolean,
  IsDateString,
} from 'class-validator';

/**
 * DTO для создания пользователя
 *
 * Базовый DTO для поддержки auth функционала.
 * В дальнейшем будет расширен в соответствии с Production API.
 */
export class CreateUserDto {
  @ApiProperty({
    description: 'Уникальное имя пользователя',
    example: 'john_doe',
  })
  @IsString()
  username: string;

  @ApiProperty({
    description: 'Email адрес пользователя',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Пароль пользователя (хешированный)',
    example: 'hashedPassword',
  })
  @IsString()
  password: string;

  @ApiProperty({
    description: 'Провайдер OAuth (опционально)',
    example: 'google',
    required: false,
  })
  @IsOptional()
  @IsString()
  oauthProvider?: string;

  @ApiProperty({
    description: 'ID пользователя в OAuth системе (опционально)',
    example: '123456789',
    required: false,
  })
  @IsOptional()
  @IsString()
  oauthId?: string;

  @ApiProperty({
    description: 'Статус подтверждения email',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  emailConfirmed?: boolean;

  @ApiProperty({
    description: 'Код подтверждения email (опционально)',
    example: '550e8400-e29b-41d4-a716-446655440000',
    required: false,
  })
  @IsOptional()
  @IsString()
  confirmationCode?: string;

  @ApiProperty({
    description: 'Время истечения кода подтверждения (опционально)',
    example: '2025-12-31T23:59:59.000Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  confirmationExpires?: string;

  @ApiProperty({
    description: 'Код восстановления пароля (опционально)',
    example: '550e8400-e29b-41d4-a716-446655440001',
    required: false,
  })
  @IsOptional()
  @IsString()
  recoveryCode?: string;

  @ApiProperty({
    description: 'Время истечения кода восстановления (опционально)',
    example: '2025-12-31T23:59:59.000Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  recoveryExpires?: string;
}
