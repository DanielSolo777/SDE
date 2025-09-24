import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';              // ← NUEVO
import { Usuario } from '../usuario/entities/usuario.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario) private readonly repo: Repository<Usuario>,
    private readonly jwt: JwtService,                 // ← NUEVO
  ) {}

  /**
   * Valida credenciales y devuelve el usuario sin el hash.
   */
  async validate(email: string, password: string) {
    const user = await this.repo
      .createQueryBuilder('u')
      .addSelect('u.passwordHash') // en la entidad: select:false
      .where('LOWER(u.email) = LOWER(:email)', { email })
      .andWhere('u.activo = true')
      .getOne();

    if (!user) throw new UnauthorizedException('Credenciales inválidas');

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Credenciales inválidas');

    // No devuelvas el hash
    const { passwordHash, ...safe } = user as any;
    return safe as Usuario;
  }

  /** Marca último login (opcional, separado de validate) */
  async marcarUltimoLogin(userId: string) {
    await this.repo.update(userId, { ultimoLogin: new Date() });
  }

  /** Firma y devuelve el JWT */
  async login(user: Usuario) {
    const payload = { sub: user.id, email: user.email, rol: user.rol };
    return { access_token: this.jwt.sign(payload) };
  }
}
