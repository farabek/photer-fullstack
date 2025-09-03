import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, MaxLength } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({
    description: 'Post description (optional)',
    example: 'My awesome post content',
    maxLength: 500,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500, {
    message: 'Description cannot be longer than 500 characters',
  })
  description?: string;
}
