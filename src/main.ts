import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);
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
}
bootstrap();
