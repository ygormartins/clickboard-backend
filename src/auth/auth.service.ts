import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import Redis from 'ioredis';
import { ConfigService } from 'src/config/config.service';
import { User, UserDocument } from 'src/users/users.schema';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';
import { hash, compare } from 'bcrypt';
import { resizeImage } from 'src/utils/image.utils';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { ulid } from 'ulid';

const MAX_USER_SESSIONS = 5;

export interface AuthResponse extends User {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRedis()
    private redis: Redis,
    private usersService: UsersService,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async validate(loginDto: LoginDto): Promise<AuthResponse> {
    const user = await this.usersService.getUserByEmail(loginDto.email);

    if (!user) throw new HttpException('User not found', 404);

    if (!(await compare(loginDto.password, user.password)))
      throw new HttpException('Incorrect email or password', 401);

    const jti = ulid();

    const { accessToken, refreshToken } = await this.getJwtFromPayload(
      user.email,
      user._id,
      jti,
    );

    await this.registerSession(user._id, jti);

    const userResponse = user.toJSON() as User;

    return {
      ...userResponse,
      accessToken,
      refreshToken,
    };
  }

  async userInfo(userId: string): Promise<Partial<UserDocument>> {
    const user = await this.usersService.getUser(userId);

    if (!user) throw new HttpException('User not found', 404);

    return user;
  }

  async register(signUpDto: SignUpDto): Promise<AuthResponse> {
    const userCheck = await this.usersService.getUserByEmail(signUpDto.email);

    if (userCheck)
      throw new HttpException("There's already an user with this email", 400);

    const hashedPassword = await hash(
      signUpDto.password,
      Number(this.configService.get('SALT_ROUNDS')),
    );

    let base64Avatar = undefined;

    if (signUpDto.avatar) {
      const resizedImage = await resizeImage(signUpDto.avatar.buffer, 100);

      base64Avatar = resizedImage.toString('base64');
    }

    const user = await this.usersService.createUser({
      ...signUpDto,
      password: hashedPassword,
      avatar: base64Avatar,
    });

    const jti = ulid();

    const { accessToken, refreshToken } = await this.getJwtFromPayload(
      user.email,
      user._id,
      jti,
    );

    await this.registerSession(user._id, jti);

    const userResponse = user.toJSON() as User;

    return {
      ...userResponse,
      accessToken,
      refreshToken,
    };
  }

  async refresh(userId: string, jti: string) {
    if (!jti?.length || !(await this.verifySession(userId, jti)))
      throw new HttpException('Invalid or expired refresh token', 401);

    const user = await this.usersService.getUser(userId);

    const { accessToken } = await this.getJwtFromPayload(
      user.email,
      user._id,
      ulid(),
    );

    return { accessToken };
  }

  async logout(userId: string, jti: string): Promise<void> {
    const key = `${userId}:${jti}`;
    const session = await this.redis.get(key);

    const parsedSession = JSON.parse(session || '{}');

    if (Object.keys(parsedSession)?.length) {
      const ttl = await this.redis.ttl(key);
      const newPayload = JSON.stringify({ ...parsedSession, active: false });
      await this.redis.set(key, newPayload, 'EX', ttl);
    }
  }

  async getJwtFromPayload(
    email: string,
    _id: string,
    jti: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { email, _id },
        {
          secret: this.configService.get('JWT_SECRET'),
          expiresIn: Number(this.configService.get('JWT_EXPIRY')),
        },
      ),
      this.jwtService.signAsync(
        { email, _id, jti },
        {
          secret: this.configService.get('REFRESH_SECRET'),
          expiresIn: Number(this.configService.get('REFRESH_EXPIRY')),
        },
      ),
    ]);

    return { accessToken, refreshToken };
  }

  async verifySession(userId: string, jti: string): Promise<boolean> {
    const session = await this.redis.get(`${userId}:${jti}`);

    const parsedSession = JSON.parse(session || '{}');

    return Object.keys(parsedSession)?.length && parsedSession.active;
  }

  async registerSession(userId: string, jti: string) {
    const duration = Number(this.configService.get('REFRESH_EXPIRY'));
    const [, userSessions] = await this.redis.scan(0, 'MATCH', `${userId}:*`);

    const sortedSessions = userSessions.sort();

    if (sortedSessions?.length >= MAX_USER_SESSIONS) {
      await this.redis.del(sortedSessions[0]);
    }

    const startedAt = new Date();
    const expiresAt = new Date(startedAt.getTime() + duration * 1000);
    const active = true;

    const payload = JSON.stringify({ startedAt, expiresAt, active });

    await this.redis.set(`${userId}:${jti}`, payload, 'EX', duration);
  }
}
