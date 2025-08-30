import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { UpdatePhotoDto } from './dto/update-photo.dto';

@Injectable()
export class PhotosService {
  constructor(private prisma: PrismaService) {}

  async create(createPhotoDto: CreatePhotoDto, userId: string) {
    return this.prisma.photo.create({
      data: {
        ...createPhotoDto,
        userId,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.photo.findMany({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async findOne(id: string, userId: string) {
    return this.prisma.photo.findFirst({
      where: { id, userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async update(id: string, updatePhotoDto: UpdatePhotoDto, userId: string) {
    return this.prisma.photo.update({
      where: { id, userId },
      data: updatePhotoDto,
    });
  }

  async remove(id: string, userId: string) {
    return this.prisma.photo.delete({
      where: { id, userId },
    });
  }
}
