import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { Usuario } from './entities/usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario])], // 👈 conecta la entidad con TypeORM
  controllers: [UsuarioController],
  providers: [UsuarioService],
  exports: [TypeOrmModule], // 👈 exporta si luego Auth u otros módulos lo necesitan
})
export class UsuarioModule {}