import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as morgan from 'morgan';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { ResponseTransformInterceptor } from './base/middlewares/response.interceptor';
import { HttpExceptionFilter } from './base/middlewares/http-exception.filter';
import { LoggerService } from './base/logger/logger.service';
import { SwaggerConfig } from './base/swagger/swagger.config';
import { config } from './base/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const loggerService = app.get(LoggerService);
  const logger = loggerService.getLogger();

  app.enableCors();
  app.use(`/uploads`, express.static('uploads'));
  app.use(`/audio`, express.static('audio'));
  app.use(bodyParser.json({ limit: '200mb' }));
  app.use(cookieParser());
  app.use(morgan('dev'));

  app.useGlobalInterceptors(new ResponseTransformInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter(loggerService));
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: () => new ValidationError(),
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  SwaggerConfig(app, config.API_VERSION);

  app.setGlobalPrefix(`api/v${config.API_VERSION}`);
  await app.listen(config.PORT, () => {
    logger.log(`server is starting on port ${config.PORT}`);
  });
}
bootstrap();
