import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { config } from '@/config';

export const SwaggerConfig = (app: INestApplication, apiVersion: string) => {
  const options = new DocumentBuilder()
    .setTitle('Nestjs base example')
    .setDescription('The base API description')
    .setVersion('1.0')
    .addBearerAuth()
    .addServer(`http://localhost:${config.PORT}/api/v${apiVersion}`, 'local')
    .addServer(
      `http://${config.IP}:${config.PORT}/api/v${apiVersion}`,
      'host-ip',
    )
    .addServer(
      `https://2f75-14-232-135-216.ngrok-free.app/api/v1`,
      'ngrok server',
    )
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup(`api/v${apiVersion}/apidoc`, app, document);
};
