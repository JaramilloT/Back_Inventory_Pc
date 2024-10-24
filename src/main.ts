import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
// import { CorsMiddleware } from './middlewares/cors.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Establecer prefijo global para las rutas de la API
  app.setGlobalPrefix('api/v1');

  // Configurar pipes de validación globales
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,           // Ignora propiedades no definidas en el DTO
      forbidNonWhitelisted: true, // Rechaza propiedades no definidas en el DTO
      transform: true,           // Transforma la entrada a los tipos esperados
    }),
  );

  // app.use(new CorsMiddleware().use);


  
  // Configuración de Swagger para documentación de la API
  const config = new DocumentBuilder()
    .setTitle('EMCA')             // Título de la documentación
    .setDescription('PCS')        // Descripción breve
    .setVersion('1.0')             // Versión de la API
    .addTag('EMCA')               // Etiquetas para organización en Swagger
    .addBearerAuth()               // Añadir autenticación Bearer
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('EMCA', app, document);

  // Inicia la aplicación en el puerto definido en la variable de entorno o en el puerto 3000
  const port=process.env.PORT || 3000
  await app.listen(port);
}

bootstrap();
