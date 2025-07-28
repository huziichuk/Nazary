import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import AUTH_MESSAGES from '../constants/auth.messages';
import { DatabaseService } from '../database/database.service';
import { SessionModule } from '../session/session.module';
import { UserModule } from '../user/user.module';
import { AuthModule } from './auth.module';

describe('AuthController (e2e)', () => {
	let app: INestApplication;
	let databaseService: DatabaseService;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [
				AuthModule,
				SessionModule,
				await ConfigModule.forRoot({ isGlobal: true }),
				UserModule,
				JwtModule.register({
					secret: process.env.JWT_SECRET || 'test',
					signOptions: { expiresIn: '60s' },
				}),
			],
		}).compile();

		app = moduleRef.createNestApplication();
		databaseService = app.get(DatabaseService);

		app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
		app.use(cookieParser());
		await app.init();
	});

	beforeAll(async () => {
		await databaseService.user.delete({
			where: {
				email: 'test@email.com',
			},
		});
	});

	afterAll(async () => {
		await app.close();
	});

	const userData = {
		email: 'test@email.com',
		password: 'Password1',
		name: 'Test User',
	};

	it('should register user', async () => {
		await request(app.getHttpServer())
			.post('/auth/register')
			.send(userData)
			.expect(201);
	});

	it('should login user and test auth', async () => {
		const loginRes = await request(app.getHttpServer())
			.post('/auth/login')
			.send({ email: userData.email, password: userData.password })
			.expect(200);
		expect(loginRes.headers['set-cookie']).toBeDefined();

		const cookies = loginRes.get('Set-Cookie') as string[];

		const res = await request(app.getHttpServer())
			.get('/auth/isAuth')
			.set('Cookie', cookies)
			.expect(200);

		expect(res.body).toEqual({ message: AUTH_MESSAGES.SUCCESS.AUTHORIZED });
	});

	it('should return 401 if no auth token is provided', async () => {
		await request(app.getHttpServer()).get('/auth/isAuth').expect(401);
	});
});
