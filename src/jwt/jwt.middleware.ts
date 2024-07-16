import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) { }

  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        const decoded = this.jwtService.verify(token);
        req.user = decoded; // Almacena la información del usuario decodificada en el request
        next();
      } catch (err) {
        res.status(401).json({ message: 'Token inválido' });
      }
    } else {
      res.status(401).json({ message: 'Token de autorización no encontrado' });
    }
  }
}
