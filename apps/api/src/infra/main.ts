import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvService } from './env/env.service';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    crossOriginEmbedderPolicy: false,
  }));

  const config = new DocumentBuilder()
    .setTitle('🚀 Nexu API')
    .setVersion('1.0.0')
    .setDescription(`
      # 🌟 API do Nexu
    `)
    .setContact(
      'Equipe Nexu',
      'https://nexu.app',
      'dev@nexu.app'
    )
    .setLicense(
      'MIT License',
      'https://opensource.org/licenses/MIT'
    )
    .addServer('http://localhost:3001', 'Desenvolvimento Local')
    .addServer('https://api.nexu.app', 'Produção')
    .addBearerAuth(
      {
        type: 'apiKey',
        in: 'cookie',
        name: 'accessToken',
        description: 'Token de acesso em cookie HttpOnly',
      },
      'HttpOnly Cookies'
    )
    .build();

  const document: OpenAPIObject = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    customSiteTitle: '🚀 Nexu API Documentation',
    customfavIcon: '/favicon.ico',
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info .title { color: #2563eb; }
      .swagger-ui .scheme-container { background: #f8fafc; padding: 20px; border-radius: 8px; }
    `,
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
      showExtensions: true,
      showCommonExtensions: true,
      tryItOutEnabled: true,
    },
  });

  const configService: EnvService = app.get(EnvService);
  const port: number = configService.get('PORT');

  app.enableCors({
    origin: [
      'http://localhost:3000',
      `http://localhost:${port}`,
      'https://nexu.app'
    ],
    methods: 'GET,PUT,POST,DELETE,PATCH',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  });

  await app.listen(port);
  console.log(`🚀 API is running on http://localhost:${port}`);
  console.log(`📚 API Documentation available at http://localhost:${port}/api-docs`);
}

bootstrap();