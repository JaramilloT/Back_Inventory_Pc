import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as express from 'express';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config(); // Cargar variables de entorno desde .env

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.FRONTEND_URL, // Usa la URL del frontend desde el archivo .env
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

  const config = new DocumentBuilder()
    .setTitle('EMCA')
    .setDescription('PCS')
    .setVersion('1.0')
    .addTag('EMCA')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('EMCA', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0'); // Escuchar en 0.0.0.0 para acceso desde cualquier IP local
}

bootstrap();
