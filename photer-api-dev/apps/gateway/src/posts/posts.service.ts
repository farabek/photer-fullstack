import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostOutputDto, PostOwnerOutputDto } from './dto/post-output.dto';
// Убираем несуществующий тип Post, оставляем только существующие
import { User, Profile } from '@prisma/client';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Создает новый пост
   */
  async createPost(
    createPostDto: CreatePostDto,
    userId: string,
    photoUrls: string[],
  ): Promise<PostOutputDto> {
    // Получаем пользователя и профиль для owner информации
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const post = await this.prisma.photo.create({
      data: {
        title: 'Post', // Временное название
        description: createPostDto.description || null,
        url: photoUrls.join(','), // Сохраняем URLs через запятую
        tags: null,
        userId,
      },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
    });

    return this.mapToPostOutputDto(post);
  }

  /**
   * Получает все посты с пагинацией
   */
  async getAllPosts(
    pageNumber: number = 1,
    pageSize: number = 8,
    sortDirection: 'asc' | 'desc' = 'desc',
    sortBy: string = 'createdAt',
  ): Promise<{
    items: PostOutputDto[];
    totalCount: number;
    pagesCount: number;
    page: number;
    pageSize: number;
  }> {
    const skip = (pageNumber - 1) * pageSize;

    // Получаем общее количество постов
    const totalCount = await this.prisma.photo.count();

    // Получаем посты с пагинацией и сортировкой
    const posts = await this.prisma.photo.findMany({
      skip,
      take: pageSize,
      orderBy: {
        [sortBy]: sortDirection,
      },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
    });

    const items = posts.map((post) => this.mapToPostOutputDto(post));
    const pagesCount = Math.ceil(totalCount / pageSize);

    return {
      items,
      totalCount,
      pagesCount,
      page: pageNumber,
      pageSize,
    };
  }

  /**
   * Получает пост по ID
   */
  async getPostById(id: string): Promise<PostOutputDto> {
    const post = await this.prisma.photo.findUnique({
      where: { id },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return this.mapToPostOutputDto(post);
  }

  /**
   * Обновляет пост
   */
  async updatePost(
    id: string,
    updatePostDto: UpdatePostDto,
    userId: string,
  ): Promise<PostOutputDto> {
    const post = await this.prisma.photo.findUnique({
      where: { id },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // Проверяем, что пользователь обновляет свой пост
    if (post.userId !== userId) {
      throw new ForbiddenException('You can only update your own posts');
    }

    const updatedPost = await this.prisma.photo.update({
      where: { id },
      data: {
        description: updatePostDto.description,
      },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
    });

    return this.mapToPostOutputDto(updatedPost);
  }

  /**
   * Удаляет пост
   */
  async deletePost(id: string, userId: string): Promise<void> {
    const post = await this.prisma.photo.findUnique({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // Проверяем, что пользователь удаляет свой пост
    if (post.userId !== userId) {
      throw new ForbiddenException('You can only delete your own posts');
    }

    await this.prisma.photo.delete({
      where: { id },
    });
  }

  /**
   * Получает все посты пользователя по userId или username
   */
  async getUserPosts(
    userIdentifier: string,
    pageNumber: number = 1,
    pageSize: number = 8,
    sortDirection: 'asc' | 'desc' = 'desc',
    sortBy: string = 'createdAt',
  ): Promise<{
    items: PostOutputDto[];
    totalCount: number;
    pagesCount: number;
    page: number;
    pageSize: number;
  }> {
    console.log('PostsService.getUserPosts called with:', {
      userIdentifier,
      pageNumber,
      pageSize,
      sortDirection,
      sortBy,
    });

    let userId: string | null = null;

    // Сначала пытаемся найти пользователя напрямую по userIdentifier как userId
    console.log('Trying to find user by id:', userIdentifier);
    const userById = await this.prisma.user.findUnique({
      where: { id: userIdentifier },
      select: { id: true },
    });

    if (userById) {
      userId = userById.id;
      console.log('Found user by id:', userId);
    } else {
      // Если не найден по id, ищем по username через профиль
      console.log(
        'User not found by id, trying to find by username:',
        userIdentifier,
      );
      const profile = await this.prisma.profile.findUnique({
        where: { username: userIdentifier },
        select: { userId: true },
      });

      if (profile) {
        userId = profile.userId;
        console.log('Found userId:', userId, 'for username:', userIdentifier);
      } else {
        console.log('Profile not found for username:', userIdentifier);
        return {
          items: [],
          totalCount: 0,
          pagesCount: 0,
          page: pageNumber,
          pageSize,
        };
      }
    }

    const skip = (pageNumber - 1) * pageSize;

    // Получаем общее количество постов пользователя
    const totalCount = await this.prisma.photo.count({
      where: { userId },
    });

    console.log('Total posts count for userId:', userId, 'is:', totalCount);

    // Получаем посты пользователя с пагинацией и сортировкой
    const posts = await this.prisma.photo.findMany({
      where: { userId },
      skip,
      take: pageSize,
      orderBy: {
        [sortBy]: sortDirection,
      },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
    });

    console.log('Found posts for userId:', userId, 'count:', posts.length);
    if (posts.length > 0) {
      console.log('First post user info:', {
        userId: posts[0].user.id,
        username: posts[0].user.username,
        hasProfile: !!posts[0].user.profile,
      });
    }

    const items = posts.map((post) => this.mapToPostOutputDto(post));
    const pagesCount = Math.ceil(totalCount / pageSize);

    console.log('Returning posts result:', {
      itemsCount: items.length,
      totalCount,
      pagesCount,
      page: pageNumber,
      pageSize,
    });

    return {
      items,
      totalCount,
      pagesCount,
      page: pageNumber,
      pageSize,
    };
  }

  /**
   * Преобразует данные из Prisma в PostOutputDto
   */
  private mapToPostOutputDto(post: any): PostOutputDto {
    // Разбираем URL фотографий (хранятся через запятую)
    const photos = post.url ? post.url.split(',').filter(Boolean) : [];

    console.log('mapToPostOutputDto:', {
      postId: post.id,
      rawUrl: post.url,
      photosCount: photos.length,
      photos,
    });

    // Создаем owner информацию
    const owner: PostOwnerOutputDto = {
      userId: post.user.id,
      userName: post.user.profile?.username || post.user.username,
      firstName: post.user.profile?.firstName || null,
      lastName: post.user.profile?.lastName || null,
      avatarUrl: post.user.profile?.avatarUrl?.[0] || null,
    };

    return {
      id: post.id,
      description: post.description,
      photos,
      owner,
      status: true, // Все посты публичные по умолчанию
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    };
  }
}
