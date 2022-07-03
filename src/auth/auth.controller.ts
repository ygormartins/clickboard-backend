import {
  Body,
  Controller,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ImageInterceptor } from 'src/common/interceptors/image-interceptor';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { LocalRequest } from './strategies/local.strategy';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  login(@Req() req: LocalRequest) {
    return req.user;
  }

  @Post('signup')
  @UseInterceptors(ImageInterceptor('avatar'))
  signup(
    @Body() signUpDto: SignUpDto,
    @UploadedFile() avatar: Express.Multer.File,
  ) {
    return this.authService.register({ ...signUpDto, avatar });
  }
}
