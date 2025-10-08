import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, Index
} from 'typeorm';

export enum Rol {
  ADMIN = 'admin',
  VIEWER = 'viewer', // solo ver/descargar
}

@Entity('usuarios')
@Index('UQ_usuario_email', ['email'], { unique: true })
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 80 })
  nombre: string;

  @Column({ name: 'apellido_paterno', length: 80 })
  apellidoPaterno: string;

  @Column({ name: 'apellido_materno', length: 80, nullable: true })
  apellidoMaterno?: string;

  @Column({ length: 20, nullable: true })
  telefono?: string;

  @Column({ length: 120, nullable: true })
  puesto?: string;

  @Column({ length: 160 })
  email: string;

  // hash de contraseña (no se devuelve en consultas normales)
  // importante para que NO salga por defecto en consultas normales
  @Column({ name: 'password_hash', length: 255, select: false })
  passwordHash: string;

  @Column({ type: 'enum', enum: Rol, default: Rol.VIEWER })
  rol: Rol;

  @Column({ default: true })
  activo: boolean;

  // lo dejamos por si luego restringimos quién puede crear usuarios
  @Column({ name: 'can_create_users', default: false })
  canCreateUsers: boolean;

  @Column({ name: 'ultimo_login', type: 'timestamptz', nullable: true })
  ultimoLogin?: Date;

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn: Date;

  @UpdateDateColumn({ name: 'actualizado_en' })
  actualizadoEn: Date;
}
