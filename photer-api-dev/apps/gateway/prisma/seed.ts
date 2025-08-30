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
      email: 'test@example.com',
      name: 'Test User',
      password: hashedPassword,
    },
  });

  // Create test photos (individual creates for SQLite)
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

  console.log('Seed completed successfully');
  console.log('Created user:', user.email);
  console.log('Created photos:', photo1.title, photo2.title);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
