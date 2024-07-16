import { HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService
    ) { }


    //1- login
    async login(email: any, password: any) {
        const validUser: any = await this.validateUser(email, password);
        const payload = { userId: validUser.id, username: validUser.name };
        return {
            uid: validUser.id,
            userName: validUser.name,
            userMail: validUser.email,
            access_token: this.jwtService.sign(payload)

        };
    }

    // Validacion de usuario para el login.
    async validateUser(email: string, password: string) {
        // creamos un usuario en memoria para simular el login con datos traidos de la base de datos.
        const user = {
            id: 1,
            name: 'admin',
            email: 'admin@mail.com',
            password: '$2b$10$3Q6'
        }
        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        const isAuthorized = (email === user.email && password === user.password) // acá podriamos usar un Bycript para comparar las contraseñas y que sean más seguras;
        if (!isAuthorized) {
            throw new UnauthorizedException('User unauthorized');
        }

        return user;
    }


}
