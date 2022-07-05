import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerInstance } from './logger/logger.service';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app: NestExpressApplication = await NestFactory.create(AppModule, {
    // logger: new LoggerInstance(),
  });
  const port: number = 5000

  app.useLogger(app.get(LoggerInstance));
  app.setGlobalPrefix('api')

  console.log('Port running on: ', port)

  // await app.listen(port);
  await app.listen(port, () => {
    console.log('[WEB]', 'http://localhost:5000');
  });
}
bootstrap();