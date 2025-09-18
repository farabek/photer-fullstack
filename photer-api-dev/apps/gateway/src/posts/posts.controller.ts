import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostOutputDto } from './dto/post-output.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Posts')
@Controller('api/v1/posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all posts' })
  @ApiQuery({
    name: 'pageNumber',
    description: 'Page number',
    required: false,
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'pageSize',
    description: 'Number of items per page',
    required: false,
    type: Number,
    example: 8,
  })
  @ApiQuery({
    name: 'sortDirection',
    description: 'Sorting direction',
    required: false,
    enum: ['asc', 'desc'],
    example: 'desc',
  })
  @ApiQuery({
    name: 'sortBy',
    description: 'The sorting field',
    required: false,
    type: String,
    example: 'createdAt',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    schema: {
      type: 'object',
      properties: {
        items: {
          type: 'array',
          items: { $ref: '#/components/schemas/PostOutputDto' },
        },
        totalCount: { type: 'number', example: 100 },
        pagesCount: { type: 'number', example: 10 },
        page: { type: 'number', example: 1 },
        pageSize: { type: 'number', example: 8 },
      },
    },
  })
  async getAllPosts(
    @Query('pageNumber') pageNumber: number = 1,
    @Query('pageSize') pageSize: number = 8,
    @Query('sortDirection') sortDirection: 'asc' | 'desc' = 'desc',
    @Query('sortBy') sortBy: string = 'createdAt',
  ) {
    return this.postsService.getAllPosts(
      pageNumber,
      pageSize,
      sortDirection,
      sortBy,
    );
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(FilesInterceptor('files'))
  @ApiOperation({ summary: 'Create new post' })
  @ApiBody({ type: CreatePostDto })
  @ApiResponse({
    status: 201,
    description: 'Returns the newly created post',
    type: PostOutputDto,
  })
  @ApiResponse({
    status: 400,
    description: 'If the inputModel has incorrect values',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async createPost(
    @Body() createPostDto: CreatePostDto,
    @UploadedFiles() files: any[], // Исправлено: убрал Express.Multer.File
    @Req() req: any,
  ): Promise<PostOutputDto> {
    const userId = req.user?.userId;

    // Временно используем mock URLs для фотографий
    // В реальном приложении здесь будет загрузка в storage
    const photoUrls = files?.map((file) => file.path) || [
      'https://storage.example.com/1/photo1.jpg',
    ];

    return this.postsService.createPost(createPostDto, userId, photoUrls);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Returns post by id' })
  @ApiParam({
    name: 'id',
    description: 'Post ID',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: PostOutputDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
  })
  async getPostById(@Param('id') id: string): Promise<PostOutputDto> {
    return this.postsService.getPostById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update existing post' })
  @ApiParam({
    name: 'id',
    description: 'Post ID',
    type: 'string',
  })
  @ApiBody({ type: UpdatePostDto })
  @ApiResponse({
    status: 204,
    description: 'No Content',
  })
  @ApiResponse({
    status: 400,
    description: 'If the inputModel has incorrect values',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'If try to update post of other user',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
  })
  async updatePost(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @Req() req: any,
  ): Promise<PostOutputDto> {
    const userId = req.user?.userId;
    return this.postsService.updatePost(id, updatePostDto, userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete post by id' })
  @ApiParam({
    name: 'id',
    description: 'Post ID',
    type: 'string',
  })
  @ApiResponse({
    status: 204,
    description: 'No Content',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'If try to delete post of other user',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
  })
  async deletePost(@Param('id') id: string, @Req() req: any): Promise<void> {
    const userId = req.user?.userId;
    return this.postsService.deletePost(id, userId);
  }

  @Get('users/:userId')
  @ApiOperation({ summary: 'Get all user posts' })
  @ApiParam({
    name: 'userId',
    description: 'User ID',
    type: 'string',
  })
  @ApiQuery({
    name: 'pageNumber',
    description: 'Page number',
    required: false,
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'pageSize',
    description: 'Number of items per page',
    required: false,
    type: Number,
    example: 8,
  })
  @ApiQuery({
    name: 'sortDirection',
    description: 'Sorting direction',
    required: false,
    enum: ['asc', 'desc'],
    example: 'desc',
  })
  @ApiQuery({
    name: 'sortBy',
    description: 'The sorting field',
    required: false,
    type: String,
    example: 'createdAt',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    schema: {
      type: 'object',
      properties: {
        items: {
          type: 'array',
          items: { $ref: '#/components/schemas/PostOutputDto' },
        },
        totalCount: { type: 'number', example: 100 },
        pagesCount: { type: 'number', example: 10 },
        page: { type: 'number', example: 1 },
        pageSize: { type: 'number', example: 8 },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
  })
  async getUserPosts(
    @Param('userId') userIdentifier: string,
    @Query('pageNumber') pageNumber: number = 1,
    @Query('pageSize') pageSize: number = 8,
    @Query('sortDirection') sortDirection: 'asc' | 'desc' = 'desc',
    @Query('sortBy') sortBy: string = 'createdAt',
  ) {
    return this.postsService.getUserPosts(
      userIdentifier,
      pageNumber,
      pageSize,
      sortDirection,
      sortBy,
    );
  }
}
