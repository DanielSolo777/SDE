import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

// Definimos un tipo para el payload (opcional pero recomendable)
export interface JwtPayload {
  sub: string;
  email: string;
  rol: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET, // viene de .env
    });
  }

  async validate(payload: JwtPayload) {
    // Lo que estará disponible en req.user
    return {
      id: payload.sub,
      email: payload.email,
      rol: payload.rol,
    };
  }
}
