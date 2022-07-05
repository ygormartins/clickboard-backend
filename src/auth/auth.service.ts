import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from 'src/config/config.service';
import { UserDocument } from 'src/users/users.schema';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';
import { hash, compare } from 'bcrypt';
import { resizeImage } from 'src/utils/image.utils';

export interface AuthResponse extends Partial<UserDocument> {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async validate(loginDto: LoginDto): Promise<AuthResponse> {
    const user = await this.usersService.getUserByEmail(loginDto.email);

    if (!user) throw new HttpException('User not found', 404);

    if (!(await compare(loginDto.password, user.password)))
      throw new HttpException('Incorrect email or password', 401);

    const { email, firstName, lastName, spaceId, avatar, _id } = user;

    const { accessToken, refreshToken } = await this.getJwtFromPayload({
      email,
      _id,
    });

    const hashedRefreshToken = await hash(
      refreshToken,
      Number(this.configService.get('SALT_ROUNDS')),
    );

    user.refreshToken = hashedRefreshToken;
    user.save();

    return {
      id: _id,
      email,
      firstName,
      lastName,
      spaceId,
      avatar,
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

    const { email, firstName, lastName, spaceId, avatar, _id } = user;

    const { accessToken, refreshToken } = await this.getJwtFromPayload({
      email,
      _id,
    });

    const hashedRefreshToken = await hash(
      refreshToken,
      Number(this.configService.get('SALT_ROUNDS')),
    );

    user.refreshToken = hashedRefreshToken;
    user.save();

    return {
      id: _id,
      email,
      firstName,
      lastName,
      spaceId,
      avatar,
      accessToken,
      refreshToken,
    };
  }

  async refresh(userId: string, refreshToken: string) {
    const user = await this.usersService.getUser(userId);

    if (!user)
      throw new HttpException("Coundn't find user to refresh token", 404);

    const matchesRefreshToken = await compare(refreshToken, user.refreshToken);

    if (!matchesRefreshToken)
      throw new HttpException('Invalid or expired refresh token', 401);

    const { accessToken } = await this.getJwtFromPayload({
      _id: user._id,
      email: user.email,
    });

    return { accessToken };
  }

  async logout(userId: string): Promise<void> {
    const user = await this.usersService.getUser(userId);

    if (user) {
      user.refreshToken = null;
      user.save();
    }
  }

  async getJwtFromPayload(payload: {
    email: string;
    _id: string;
  }): Promise<{ accessToken: string; refreshToken: string }> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: this.configService.get('JWT_EXPIRY'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('REFRESH_SECRET'),
        expiresIn: this.configService.get('REFRESH_EXPIRY'),
      }),
    ]);

    return { accessToken, refreshToken };
  }
}
