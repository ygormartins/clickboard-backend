import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from 'src/config/config.service';
import { Request } from 'express';
import { strategies } from '.';

export interface AuthRefreshRequest extends Request {
  user: { id: string; email: string; jti: string; refreshToken: string };
}

@Injectable()
export class RefreshStrategy extends PassportStrategy(
  Strategy,
  strategies.REFRESH,
) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('REFRESH_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    const refreshToken = req.get('authorization').replace('Bearer', '').trim();
    return {
      id: payload.id,
      email: payload.email,
      jti: payload.jti,
      refreshToken,
    };
  }
}
