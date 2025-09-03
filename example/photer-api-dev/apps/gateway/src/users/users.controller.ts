import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';

/**
 * Контроллер для работы с пользователями
 *
 * Минимальная реализация для поддержки auth функционала.
 * В дальнейшем будет расширен в соответствии с Production API.
 */
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Создание нового пользователя
   *
   * Используется для внутренних операций auth.
   * В дальнейшем будет перенесен в правильный путь /api/v1/users
   */
  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: UserDto,
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  /**
   * Получение всех пользователей
   *
   * Временный эндпоинт для тестирования.
   * В дальнейшем будет удален или защищен авторизацией.
   */
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Return all users',
    type: [UserDto],
  })
  findAll() {
    // Временная реализация - в продакшене будет защищена
    return this.usersService.findAll();
  }

  /**
   * Получение пользователя по ID
   *
   * Временный эндпоинт для тестирования.
   * В дальнейшем будет удален или защищен авторизацией.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiResponse({
    status: 200,
    description: 'Return user by id',
    type: UserDto,
  })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  /**
   * Обновление пользователя
   *
   * Временный эндпоинт для тестирования.
   * В дальнейшем будет удален или защищен авторизацией.
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: UserDto,
  })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  /**
   * Удаление пользователя
   *
   * Временный эндпоинт для тестирования.
   * В дальнейшем будет удален или защищен авторизацией.
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully',
  })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
