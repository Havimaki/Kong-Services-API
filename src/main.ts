import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app: NestExpressApplication = await NestFactory.create(AppModule);
  const port: number = 5000

  app.setGlobalPrefix('api')

  console.log('Port running on: ', port)

  // await app.listen(port);
  await app.listen(port, () => {
    console.log('[WEB]', 'http://localhost:5000');
  });
}
bootstrap();