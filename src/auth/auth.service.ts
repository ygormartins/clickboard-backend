import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from 'src/config/config.service';
import { UserDocument } from 'src/users/users.schema';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';
import { hash, compare } from 'bcrypt';
import { resizeImage } from 'src/utils/image.utils';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async validate(
    loginDto: LoginDto,
  ): Promise<Partial<UserDocument> & { accessToken: string }> {
    const user = await this.usersService.getUserByEmail(loginDto.email);

    if (!user) throw new HttpException('User not found', 404);

    if (!(await compare(loginDto.password, user.password)))
      throw new HttpException('Incorrect email or password', 401);

    const { email, firstName, lastName, spaceId, avatar, _id } = user;

    const accessToken = this.getJwtFromPayload({ email, _id });

    return {
      id: _id,
      email,
      firstName,
      lastName,
      spaceId,
      avatar,
      accessToken,
    };
  }

  async register(
    signUpDto: SignUpDto,
  ): Promise<Partial<UserDocument> & { accessToken: string }> {
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

    const { email, firstName, lastName, spaceId, avatar, _id } =
      await this.usersService.createUser({
        ...signUpDto,
        password: hashedPassword,
        avatar: base64Avatar,
      });

    const accessToken = this.getJwtFromPayload({ email, _id });

    return {
      id: _id,
      email,
      firstName,
      lastName,
      spaceId,
      avatar,
      accessToken,
    };
  }

  getJwtFromPayload(payload: { email: string; _id: string }): string {
    return this.jwtService.sign(payload);
  }
}
