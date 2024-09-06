import {NestFactory} from '@nestjs/core';
import {AppModule} from './presentation/app.module';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {HttpExceptionMiddleware} from "./infrastructure/middlewares/HttpExceptionMiddleware";
import {ValidationPipe} from "@nestjs/common";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors({});

    const config = new DocumentBuilder()
        .setTitle('Plann.er API')
        .setDescription('...')
        .setVersion('1.0')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    app.useGlobalFilters(new HttpExceptionMiddleware())
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    await app.listen(3333);
}

bootstrap().then();
