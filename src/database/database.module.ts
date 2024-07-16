import { Global, InternalServerErrorException, Module, UnauthorizedException, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';


const logger = new Logger('DatabaseModule');

@Global()
@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            name: 'DB',
            useFactory: async (configService: ConfigService): Promise<TypeOrmModuleOptions> => {
                try {
                    const dbConfig: any = {
                        type: 'mongodb',
                        url: configService.get('MONGODB_URI'),
                        useUnifiedTopology: true,
                        synchronize: true, // Establecer a 'false' en producción
                        autoLoadEntities: true,
                    };
                    return dbConfig;
                } catch (e) {
                    throw new UnauthorizedException({
                        message: 'Hubo un error de integración de datos',
                    });
                }
            },
            inject: [ConfigService],
        })
    ],
    exports: [TypeOrmModule],
})
export class DatabaseModule { }
