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
      url: 'https://images.unsplash.com/photo-1501973801540-537f08ccae7b?w=1200',
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
      url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200',
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
      url: 'https://images.unsplash.com/photo-1544006659-f0b21884ce1d?w=1200',
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
      url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200',
      tags: 'landscape,mountains,nature',
      userId: user3.id,
    },
  });

  // Добавим ещё 8 постов (итого 12)
  const extra = [
    {
      id: 'forest-photo',
      title: 'Deep Forest',
      description: 'Misty morning in the forest',
      url: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200',
      tags: 'nature,forest,morning',
      userId: user.id,
    },
    {
      id: 'sea-photo',
      title: 'Sea Waves',
      description: 'Blue waves on the shore',
      url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200',
      tags: 'sea,water,waves',
      userId: user2.id,
    },
    {
      id: 'desert-photo',
      title: 'Desert Dunes',
      description: 'Golden sand dunes at sunset',
      url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200',
      tags: 'desert,sand,sunset',
      userId: user3.id,
    },
    {
      id: 'bridge-photo',
      title: 'City Bridge',
      description: 'Bridge over the river at night',
      url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200',
      tags: 'city,bridge,night',
      userId: user.id,
    },
    {
      id: 'mountain-lake-photo',
      title: 'Mountain Lake',
      description: 'Crystal clear lake in the mountains',
      url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200',
      tags: 'mountains,lake,clear',
      userId: user2.id,
    },
    {
      id: 'field-flowers-photo',
      title: 'Field of Flowers',
      description: 'Colorful flowers in the field',
      url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200',
      tags: 'field,flowers,colorful',
      userId: user3.id,
    },
    {
      id: 'night-sky-photo',
      title: 'Night Sky',
      description: 'Milky Way over the mountains',
      url: 'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?w=1200',
      tags: 'night,sky,milkyway',
      userId: user.id,
    },
    {
      id: 'forest-path-photo',
      title: 'Forest Path',
      description: 'Small path through the forest',
      url: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200',
      tags: 'forest,path,trees',
      userId: user2.id,
    },
  ];

  for (const p of extra) {
    await prisma.photo.upsert({
      where: { id: p.id },
      update: {},
      create: p,
    });
  }

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
