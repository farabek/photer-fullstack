import { IsString, IsOptional, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePhotoDto {
  @ApiProperty({ example: 'My beautiful photo' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'A description of the photo' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'https://example.com/photo.jpg' })
  @IsUrl()
  url: string;

  @ApiProperty({ example: 'nature' })
  @IsOptional()
  @IsString()
  tags?: string;
}
