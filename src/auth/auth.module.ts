import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from "src/user/user.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
@Module({
    imports: [
      ConfigModule,
      UserModule,
    ],
    controllers: [AuthController],
    providers: [AuthService],
  })
  export class AuthModule {}