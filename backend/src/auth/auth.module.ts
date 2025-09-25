import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Usuario } from '../usuario/entities/usuario.entity';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    ConfigModule, // para poder usar ConfigService
    TypeOrmModule.forFeature([Usuario]),

    // Registro asíncrono del JwtModule
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        secret: cfg.get<string>('JWT_SECRET') || 'dev-secret',
        signOptions: {
          expiresIn: cfg.get<string>('JWT_EXPIRES') || '1d', // default: 1 día
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService], // importante si otro módulo lo quiere usar
})
export class AuthModule {}
