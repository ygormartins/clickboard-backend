import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

export interface LocalRequest extends Request {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    spaceId: string;
    accessToken: string;
    avatar?: string;
  };
}

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<any> {
    return await this.authService.validate({ email, password });
  }
}
