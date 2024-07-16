import { registerAs } from '@nestjs/config';


export default registerAs('config', () => {
    return {

        mongoDB: {
            uri: process.env.MONGODB_URI,
        },
        typeorm: {
            entity_dir: process.env.TYPEORM_ENTITIES,
            migrations: process.env.TYPEORM_MIGRATIONS,
            migrations_dir: process.env.TYPEORM_MIGRATIONS_DIR,
        },
        apiKey: process.env.API_KEY,
        jwtsecret: 'secret'
    };
});
