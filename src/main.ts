import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: process.env.NODE_ENV === 'prod' ? false : ['warn', 'error', 'log'],
  });

  app.enableCors();
  const config = new DocumentBuilder()
    .setTitle('Masakin  API')
    .setDescription('This app use as recipe catalog application ')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    jsonDocumentUrl: 'swagger/json',
    customSiteTitle: 'Masakin API Docs',
  });
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
