import { Module } from '@nestjs/common';

import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',      // Host del servidor MySQL (XAMPP corre en localhost)
      port: 3306,             // Puerto de MySQL (el puerto de XAMPP por defecto es 3306)
      username: 'root',       // El usuario por defecto de XAMPP es 'root'
      password: '',           // La contraseña por defecto de XAMPP es vacía
      database: 'emca',       // Nombre de la base de datos que creaste en phpMyAdmin
      entities: [User],       // Asegúrate de que la entidad está importada
      synchronize: true,      // Solo para desarrollo, sincroniza automáticamente las tablas con las entidades
    }),
    UserModule,
    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
