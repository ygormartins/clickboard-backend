import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from 'src/config/config.service';
import { UserDocument } from 'src/users/users.schema';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';
import { hash, compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
  ) {}

  async login(
    loginDto: LoginDto,
  ): Promise<Partial<UserDocument> & { accessToken: string }> {
    const user = await this.usersService.getUserByEmail(loginDto.email);

    if (!user) throw new HttpException('User not found', 404);

    if (!(await compare(loginDto.password, user.password)))
      throw new HttpException('Incorrect email or password', 401);

    const { email, firstName, lastName, spaceId, avatar } = user;

    return {
      email,
      firstName,
      lastName,
      spaceId,
      avatar,
      accessToken: 'blah',
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

    const { email, firstName, lastName, spaceId, avatar } =
      await this.usersService.createUser({
        ...signUpDto,
        password: hashedPassword,
      });

    return {
      email,
      firstName,
      lastName,
      spaceId,
      avatar,
      accessToken: 'blah',
    };
  }
}
