import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

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
}
// --- IGNORE ---