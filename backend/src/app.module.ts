import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-ioredis-yet';
import { UsuarioModule } from './usuario/usuario.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        type: 'postgres',
        host: cfg.get<string>('PG_HOST'),
        port: Number(cfg.get('PG_PORT')),
        username: cfg.get<string>('PG_USER'),
        password: String(cfg.get('PG_PASS') ?? ''), // ← asegura string
        database: cfg.get<string>('PG_DB'),
        autoLoadEntities: true,
        synchronize: true, // solo desarrollo
      }),
    }),

    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: async (cfg: ConfigService) => ({
        store: await redisStore({
          socket: {
            host: cfg.get<string>('REDIS_HOST'),
            port: Number(cfg.get('REDIS_PORT')),
          },
        }),
      }),
    }),

    UsuarioModule,

    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}