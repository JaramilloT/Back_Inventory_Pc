import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as express from 'express';
import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config();

mysql://root:dPRUvlaKaxTtWgODZkKoQmEisbGxzlfq@nozomi.proxy.rlwy.net:54741/railway

dotenv.config(); // Cargar variables de entorno

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Debug: Ver variables de entorno
  console.log('🔧 Variables de entorno:');
  console.log('FRONTEND_URL:', process.env.FRONTEND_URL);
  console.log('PORT:', process.env.PORT);
  console.log('NODE_ENV:', process.env.NODE_ENV);

  // Configurar orígenes permitidos
  const frontendUrls = process.env.FRONTEND_URL || 'http://localhost:3001';
  const allowedOrigins = frontendUrls.split(',').map(origin => origin.trim());
  
  console.log('🌐 Orígenes permitidos:', allowedOrigins);

  // Middleware de debug para ver las peticiones
  app.use((req, res, next) => {
    console.log(`🔍 ${req.method} ${req.url} - Origin: ${req.headers.origin || 'No Origin'}`);
    next();
  });

  // Configuración CORS mejorada
  app.enableCors({
    origin: function (origin, callback) {
      // Permitir peticiones sin origin (Postman, curl, etc.)
      if (!origin) {
        console.log('✅ Petición sin origin permitida');
        return callback(null, true);
      }

      console.log('🔍 Verificando origin:', origin);

      // Verificar si el origin está en la lista permitida
      if (allowedOrigins.includes(origin)) {
        console.log('✅ Origin permitido:', origin);
        return callback(null, true);
      }

      // En desarrollo, ser más permisivo con localhost
      if (process.env.NODE_ENV === 'development' && origin.includes('localhost')) {
        console.log('✅ Origin localhost permitido en desarrollo:', origin);
        return callback(null, true);
      }

      console.error('❌ Origin no permitido:', origin);
      console.error('❌ Orígenes permitidos:', allowedOrigins);
      return callback(new Error(`CORS: Origin ${origin} no permitido`));
    },
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Origin', 
      'X-Requested-With', 
      'Content-Type', 
      'Accept', 
      'Authorization',
      'Cache-Control',
      'X-HTTP-Method-Override'
    ],
    exposedHeaders: ['set-cookie'],
    optionsSuccessStatus: 200
  });

  // Prefijo global para API
  app.setGlobalPrefix('api/v1');

  // Pipes de validación
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Servir archivos estáticos
  app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

  // Configuración Swagger
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
  
  await app.listen(port, '0.0.0.0');
  
  console.log(`🚀 Servidor ejecutándose en:`);
  console.log(`   - Local: http://localhost:${port}`);
  console.log(`   - Red: http://192.168.100.55:${port}`);
  console.log(`   - Swagger: http://localhost:${port}/EMCA`);
}

bootstrap().catch(error => {
  console.error('❌ Error al iniciar el servidor:', error);
});