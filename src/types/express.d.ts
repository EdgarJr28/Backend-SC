import { Request } from 'express';

declare global {
    namespace Express {
        interface Request {
            user?: any; // Puedes ajustar el tipo `any` a la interfaz de tu usuario
        }
    }
}
