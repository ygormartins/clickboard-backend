import {
  Body,
  Controller,
  Get,
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
import { strategies } from './strategies';
import { AuthRequest } from './strategies/jwt.strategy';
import { AuthRefreshRequest } from './strategies/refresh.strategy';
import { LocalRequest } from './strategies/local.strategy';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard(strategies.JWT))
  @Get('whoami')
  whoami(@Req() req: AuthRequest) {
    return this.authService.userInfo(req.user.id);
  }

  @UseGuards(AuthGuard(strategies.LOCAL))
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

  @UseGuards(AuthGuard(strategies.REFRESH))
  @Post('logout')
  async logout(@Req() req: AuthRefreshRequest) {
    await this.authService.logout(req.user.id, req.user.jti);
  }

  @UseGuards(AuthGuard(strategies.REFRESH))
  @Post('refresh')
  refresh(@Req() req: AuthRefreshRequest) {
    return this.authService.refresh(req.user.id, req.user.jti);
  }
}
