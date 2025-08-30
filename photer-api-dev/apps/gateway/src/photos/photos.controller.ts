import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PhotosService } from './photos.service';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { UpdatePhotoDto } from './dto/update-photo.dto';

@ApiTags('photos')
@Controller('photos')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PhotosController {
  constructor(private readonly photosService: PhotosService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new photo' })
  @ApiResponse({ status: 201, description: 'Photo created successfully' })
  create(@Body() createPhotoDto: CreatePhotoDto, @Request() req) {
    return this.photosService.create(createPhotoDto, req.user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all user photos' })
  @ApiResponse({ status: 200, description: 'Return all user photos' })
  findAll(@Request() req) {
    return this.photosService.findAll(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get photo by id' })
  @ApiResponse({ status: 200, description: 'Return photo by id' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.photosService.findOne(id, req.user.userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update photo' })
  @ApiResponse({ status: 200, description: 'Photo updated successfully' })
  update(
    @Param('id') id: string,
    @Body() updatePhotoDto: UpdatePhotoDto,
    @Request() req,
  ) {
    return this.photosService.update(id, updatePhotoDto, req.user.userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete photo' })
  @ApiResponse({ status: 200, description: 'Photo deleted successfully' })
  remove(@Param('id') id: string, @Request() req) {
    return this.photosService.remove(id, req.user.userId);
  }
}
