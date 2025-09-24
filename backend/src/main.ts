import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Activa validaciones globales
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,            // elimina campos no declarados en el DTO
    forbidNonWhitelisted: true, // lanza error si envías campos extras
    transform: true,            // convierte tipos automáticamente (string -> number, etc.)
  }));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
