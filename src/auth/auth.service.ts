import { User } from './../user/entities/user.entity';
import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { RegisterDto } from "./dto/register.dto";
import * as bcrypt from 'bcryptjs';
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService{
    constructor(
     private readonly userService: UserService,    
){}

    async register({nombre, apellido, correo, contraseña, codigo}: RegisterDto){
        const user = await this.userService.findOneByEmail(correo);

        const clave = "EMCA-2024-@-LASTICS"
        
        if (!codigo || codigo !== clave) {
            throw new UnauthorizedException("Acceso no autorizado. Código inválido.");
        }

        if (user) {
            throw new BadRequestException("el usuario ya es existente")
        }
      
        const hashedPassword = await bcrypt.hash(contraseña, 10);

        return await this.userService.create({
            nombre,
            apellido,
            correo,
            contraseña: hashedPassword,
            codigo,
        })
    }

    async login({correo, contraseña}: LoginDto){
        const user = await this.userService.findOneByEmail(correo);

        if (!user) {
            throw new UnauthorizedException("El correo electrónico es incorrecto")
        }

        const isPasswordValid = await bcrypt.compare(contraseña, user.contraseña);
        if (!isPasswordValid) {
            throw new UnauthorizedException("La contraseña es incorrecta");
        }
    }
}