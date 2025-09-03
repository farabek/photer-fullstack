import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

/**
 * DTO для обновления пользователя
 *
 * Наследует все поля от CreateUserDto, но делает их опциональными.
 * В дальнейшем будет расширен в соответствии с Production API.
 */
export class UpdateUserDto extends PartialType(CreateUserDto) {}
