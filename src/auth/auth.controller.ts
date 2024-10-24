import { Body, Controller, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";

@ApiTags('auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController{
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    @ApiBody({ type: RegisterDto })  // Swagger sabe que debe recibir un RegisterDto en el cuerpo
    async register(@Body() registerDto: RegisterDto) {
      return this.authService.register(registerDto);
    }
  
    @Post('login')
    @ApiBody({ type: LoginDto })  // Swagger sabe que debe recibir un LoginDto en el cuerpo
    login(@Body() loginDto: LoginDto) {
      return this.authService.login(loginDto);
    }
  
}