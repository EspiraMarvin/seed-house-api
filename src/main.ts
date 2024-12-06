import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);

  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        'http://localhost:5173',
        'http://localhost:4000',
        'http://localhost:3000',
        'https://54.211.199.61.nip.io',
      ];

      if (!origin || allowedOrigins.includes(origin)) {
        // Allow if the origin is in the allowed list or if there's no origin (like Postman or server-to-server requests)
        callback(null, true);
      } else {
        // Reject other origins
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  });

  // Enable versioning
  app.enableVersioning({
    type: VersioningType.URI, // Use URI versioning
    defaultVersion: '1',
  });

  // header versioning
  // app.enableVersioning({
  //   type: VersioningType.HEADER,
  //   header: 'X-API-Version', // Custom header name
  // });

  await app.listen(configService.get<number>('PORT') || 4000);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
}
bootstrap();
