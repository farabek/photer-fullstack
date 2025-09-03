import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileOutputDto } from './dto/profile-output.dto';
import { Profile } from '@prisma/client'; // Добавляем импорт типа Profile

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Создает новый профиль для пользователя
   */
  async createProfile(
    createProfileDto: CreateProfileDto,
    userId: string,
  ): Promise<ProfileOutputDto> {
    // Проверяем, не существует ли уже профиль для этого пользователя
    const existingProfile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (existingProfile) {
      throw new ConflictException('Profile already exists for this user');
    }

    // Проверяем, не занят ли username другим пользователем
    const existingUsername = await this.prisma.profile.findUnique({
      where: { username: createProfileDto.username },
    });

    if (existingUsername) {
      throw new ConflictException('Username is already taken');
    }

    const profile = await this.prisma.profile.create({
      data: {
        ...createProfileDto,
        userId,
        avatarUrl: [], // Инициализируем пустым массивом
      },
    });

    return this.mapToProfileOutputDto(profile);
  }

  /**
   * Получает профиль текущего пользователя
   */
  async getCurrentUserProfile(userId: string): Promise<ProfileOutputDto> {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return this.mapToProfileOutputDto(profile);
  }

  /**
   * Получает профиль по ID профиля
   */
  async getProfileById(id: string): Promise<ProfileOutputDto> {
    const profile = await this.prisma.profile.findUnique({
      where: { id },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return this.mapToProfileOutputDto(profile);
  }

  /**
   * Получает профиль по ID пользователя
   */
  async getProfileByUserId(userId: string): Promise<ProfileOutputDto> {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return this.mapToProfileOutputDto(profile);
  }

  /**
   * Обновляет профиль пользователя
   */
  async updateProfile(
    id: string,
    updateProfileDto: UpdateProfileDto,
    userId: string,
  ): Promise<ProfileOutputDto> {
    const profile = await this.prisma.profile.findUnique({
      where: { id },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    // Проверяем, что пользователь обновляет свой профиль
    if (profile.userId !== userId) {
      throw new ForbiddenException('You can only update your own profile');
    }

    // Если обновляется username, проверяем его уникальность
    if (
      updateProfileDto.username &&
      updateProfileDto.username !== profile.username
    ) {
      const existingUsername = await this.prisma.profile.findUnique({
        where: { username: updateProfileDto.username },
      });

      if (existingUsername) {
        throw new ConflictException('Username is already taken');
      }
    }

    const updatedProfile = await this.prisma.profile.update({
      where: { id },
      data: updateProfileDto,
    });

    return this.mapToProfileOutputDto(updatedProfile);
  }

  /**
   * Удаляет профиль пользователя (для тестирования)
   */
  async deleteProfile(userId: string): Promise<void> {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    await this.prisma.profile.delete({
      where: { userId },
    });
  }

  /**
   * Загружает аватар профиля
   */
  async uploadAvatar(
    userId: string,
    fileUrl: string,
  ): Promise<{ fileUrl: string }> {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    // Добавляем новый URL аватара в массив
    const updatedAvatarUrls = [...profile.avatarUrl, fileUrl];

    await this.prisma.profile.update({
      where: { userId },
      data: { avatarUrl: updatedAvatarUrls },
    });

    return { fileUrl };
  }

  /**
   * Преобразует данные из Prisma в ProfileOutputDto
   */
  private mapToProfileOutputDto(profile: Profile): ProfileOutputDto {
    return {
      id: profile.id,
      username: profile.username,
      firstName: profile.firstName,
      lastName: profile.lastName,
      city: profile.city,
      country: profile.country,
      birthDate: profile.birthDate?.toISOString() || null,
      aboutMe: profile.aboutMe,
      avatarUrl: profile.avatarUrl,
      createdAt: profile.createdAt.toISOString(),
      updatedAt: profile.updatedAt.toISOString(),
    };
  }
}
