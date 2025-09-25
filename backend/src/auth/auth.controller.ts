import { Body, Controller, Post, HttpCode, HttpStatus, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    const user = await this.auth.validate(dto.email, dto.password);
    await this.auth.marcarUltimoLogin(user.id);
    const { access_token } = await this.auth.login(user);
    return {
      ok: true,
      access_token,
      user: {
        id: user.id,
        nombre: user.nombre,
        apellidoPaterno: user.apellidoPaterno,
        apellidoMaterno: user.apellidoMaterno,
        email: user.email,
        rol: user.rol,
        activo: user.activo,
        canCreateUsers: user.canCreateUsers,
      },
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  me(@Req() req: any) {
    // req.user viene del payload del JWT
    return req.user;
  }
}
