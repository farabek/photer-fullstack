import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Middleware
  app.use(cookieParser());
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Photer API Gateway')
    .setDescription('API for Photer application - photo sharing platform')
    .setVersion('1.0')
    .addServer('http://localhost:3001', 'Development server')
    .addServer('https://api.photer.com', 'Production server')
    .addTag('Auth', 'Authentication and authorization endpoints')
    .addTag('User', 'User-related endpoints')
    .addTag('Device', 'Device management endpoints')
    .addTag('Profile', 'User profile management endpoints')
    .addTag('Posts', 'Posts management endpoints')
    .addTag('Subscriptions', 'Subscription and payment endpoints')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Gateway service is running on: http://localhost:${port}`);
}

bootstrap();
