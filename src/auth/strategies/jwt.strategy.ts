import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from 'src/config/config.service';
import { Request } from 'express';
import { strategies } from '.';

export interface AuthRequest extends Request {
  user: { id: string; email: string };
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, strategies.JWT) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    return { id: payload.id, email: payload.email };
  }
}
