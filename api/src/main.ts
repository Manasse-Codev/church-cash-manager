import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const port = configService.get<number>('API_PORT', 4000);
  const corsOrigin = configService.get<string>('CORS_ORIGIN', 'http://localhost:3000');
  const nodeEnv = configService.get<string>('NODE_ENV', 'development');

  // ── Sécurité ────────────────────────────────────────────────────────────────
  app.use(helmet());

  app.enableCors({
    origin: corsOrigin.split(',').map((o) => o.trim()),
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // ── Validation globale ───────────────────────────────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,              // Supprime les champs non déclarés dans le DTO
      forbidNonWhitelisted: true,   // Rejette les requêtes avec des champs inconnus
      transform: true,              // Transforme les types automatiquement
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // ── Filtres & intercepteurs globaux ─────────────────────────────────────────
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  // ── Swagger / OpenAPI ────────────────────────────────────────────────────────
  if (nodeEnv !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('EgliseFinance API')
      .setDescription('API de gestion financière pour les églises africaines')
      .setVersion('1.0')
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'JWT-auth',
      )
      .addTag('auth', 'Authentification et gestion des sessions')
      .addTag('dashboard', 'Tableau de bord et indicateurs')
      .addTag('caisse', 'Gestion de la caisse générale')
      .addTag('investisseurs', 'Gestion des investisseurs et versements')
      .addTag('construction', 'Dépenses et suivi du chantier du temple')
      .addTag('departements', 'Gestion des départements et mouvements')
      .addTag('membres', 'Gestion des membres et formulaires publics')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });

    logger.log(`📚 Swagger disponible sur http://localhost:${port}/docs`);
  }

  await app.listen(port);
  logger.log(`🚀 API EgliseFinance démarrée sur le port ${port}`);
  logger.log(`🌍 Environnement: ${nodeEnv}`);
}

bootstrap();
