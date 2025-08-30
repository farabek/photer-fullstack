import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Delete,
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { StorageService } from './storage.service';

@ApiTags('storage')
@Controller('storage')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('upload')
  @ApiOperation({ summary: 'Upload a file' })
  @ApiResponse({ status: 201, description: 'File uploaded successfully' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const url = await this.storageService.uploadFile(file);
    return { url };
  }

  @Delete(':url')
  @ApiOperation({ summary: 'Delete a file' })
  @ApiResponse({ status: 200, description: 'File deleted successfully' })
  async deleteFile(@Param('url') url: string) {
    await this.storageService.deleteFile(decodeURIComponent(url));
    return { message: 'File deleted successfully' };
  }
}
