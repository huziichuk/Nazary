import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.use(cookieParser());

	app.enableCors({
		origin: 'http://localhost:3000',
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
	await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
