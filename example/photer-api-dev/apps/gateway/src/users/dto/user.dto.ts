import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO для отображения пользователя
 *
 * Базовый DTO для отображения информации о пользователе.
 * В дальнейшем будет расширен в соответствии с Production API.
 */
export class UserDto {
  @ApiProperty({
    description: 'Уникальный идентификатор пользователя',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Уникальное имя пользователя',
    example: 'john_doe',
  })
  username: string;

  @ApiProperty({
    description: 'Email адрес пользователя',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Провайдер OAuth (если используется)',
    example: 'google',
    required: false,
  })
  oauthProvider?: string;

  @ApiProperty({
    description: 'ID пользователя в OAuth системе',
    example: '123456789',
    required: false,
  })
  oauthId?: string;

  @ApiProperty({
    description: 'Статус подтверждения email',
    example: true,
  })
  emailConfirmed: boolean;

  @ApiProperty({
    description: 'Дата создания пользователя',
    example: '2025-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Дата последнего обновления пользователя',
    example: '2025-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}
