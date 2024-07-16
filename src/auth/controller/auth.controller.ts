import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginDto } from '../dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }



    // 2- login usuarios
    @Post('/login')
    @ApiBody({ type: LoginDto, required: true })
    @ApiOperation({ summary: 'Inicio de sesion.' })
    login(@Body() payload: { password: string, email: string }) {
        return this.authService.login(payload.email, payload.password);
    }

}
