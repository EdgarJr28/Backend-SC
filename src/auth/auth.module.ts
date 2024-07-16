import { Module } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { AuthController } from './controller/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import config from '../config';
import { ConfigModule, ConfigType } from '@nestjs/config';

import { LocalStrategy } from './guards/local.strategy';
import { PassportModule } from '@nestjs/passport';



@Module({
    imports: [
        PassportModule,
        ConfigModule,
        JwtModule.registerAsync({
            inject: [config.KEY],
            useFactory: (configService: ConfigType<typeof config>) => {
                return {
                    global: true,
                    secret: configService.jwtsecret,
                    signOptions: {
                        expiresIn: '1y',
                    },
                };
            },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy]
})
export class AuthModule { }
