import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PhotosModule } from './photos/photos.module';
import { StorageModule } from './storage/storage.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.ENV_TYPE || 'development'}`,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    ClientsModule.register([
      {
        name: 'STORAGE_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
          queue: 'storage_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
    AuthModule,
    UsersModule,
    PhotosModule,
    StorageModule,
  ],
})
export class AppModule {}
