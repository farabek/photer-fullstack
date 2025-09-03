import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create test user
  const hashedPassword = await bcrypt.hash('password123', 10);

  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      username: 'testuser',
      email: 'test@example.com',
      password: hashedPassword,
      emailConfirmed: true, // Подтверждаем email для тестового пользователя
    },
  });

  // Create test photos (individual creates for PostgreSQL)
  const photo1 = await prisma.photo.upsert({
    where: { id: 'sunset-photo' },
    update: {},
    create: {
      id: 'sunset-photo',
      title: 'Beautiful Sunset',
      description: 'A stunning sunset over the mountains',
      url: 'https://example.com/sunset.jpg',
      tags: 'nature,sunset,mountains',
      userId: user.id,
    },
  });

  const photo2 = await prisma.photo.upsert({
    where: { id: 'city-photo' },
    update: {},
    create: {
      id: 'city-photo',
      title: 'City Lights',
      description: 'Urban night photography',
      url: 'https://example.com/city.jpg',
      tags: 'urban,night,city',
      userId: user.id,
    },
  });

  // Добавляем еще несколько тестовых пользователей
  const user2 = await prisma.user.upsert({
    where: { email: 'john@example.com' },
    update: {},
    create: {
      username: 'john_doe',
      email: 'john@example.com',
      password: hashedPassword,
      emailConfirmed: true,
    },
  });

  const user3 = await prisma.user.upsert({
    where: { email: 'jane@example.com' },
    update: {},
    create: {
      username: 'jane_smith',
      email: 'jane@example.com',
      password: hashedPassword,
      emailConfirmed: true,
    },
  });

  // Добавляем фото для новых пользователей
  const photo3 = await prisma.photo.upsert({
    where: { id: 'portrait-photo' },
    update: {},
    create: {
      id: 'portrait-photo',
      title: 'Portrait Photography',
      description: 'Professional portrait session',
      url: 'https://example.com/portrait.jpg',
      tags: 'portrait,professional,photography',
      userId: user2.id,
    },
  });

  const photo4 = await prisma.photo.upsert({
    where: { id: 'landscape-photo' },
    update: {},
    create: {
      id: 'landscape-photo',
      title: 'Mountain Landscape',
      description: 'Breathtaking mountain views',
      url: 'https://example.com/landscape.jpg',
      tags: 'landscape,mountains,nature',
      userId: user3.id,
    },
  });

  console.log('Seed completed successfully');
  console.log('Created users:', user.username, user2.username, user3.username);
  console.log(
    'Created photos:',
    photo1.title,
    photo2.title,
    photo3.title,
    photo4.title,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
