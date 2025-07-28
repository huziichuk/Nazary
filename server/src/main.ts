import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.use(cookieParser());

	app.enableCors({
		origin: process.env.CLIENT_URL,
		credentials: true,
	});

	const config = new DocumentBuilder()
		.setTitle('Nazary API')
		.setDescription('API documentation for Nazary project')
		.setVersion('1.0')
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api/docs', app, document);

	app.enableShutdownHooks();
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
		}),
	);

	await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
