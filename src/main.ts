import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const PORT = process.env.PORT || 5000;

  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.enableCors({
    credentials: true,
    origin: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Advanced lesson Backend')
    .setDescription('Documentation REST API')
    .setVersion('1.0.0')
    .addTag('main')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  //we can add global pipes for all routes, here can be lots of pipes, one by one
  // app.useGlobalPipes(new ValidationPipe());

  await app.listen(PORT, () => console.log(`Server started on port = ${PORT}`));
}
bootstrap();
