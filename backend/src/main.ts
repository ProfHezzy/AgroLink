import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';

async function bootstrap() {
  // Create NestJS application instance
  const app = await NestFactory.create(AppModule);

  // Increase body limit for image uploads
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // Enable CORS for frontend communication
  app.enableCors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
  });

  // Enable global validation pipe for DTOs
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Strip properties that don't have decorators
    forbidNonWhitelisted: true, // Throw error if non-whitelisted values are provided
    transform: true, // Auto-transform payloads to DTO instances
  }));

  // Start server on port 3001
  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 AgroLink API running on http://localhost:${port}`);
}
bootstrap();
