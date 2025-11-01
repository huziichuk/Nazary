import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import cookieParser from 'cookie-parser';
import { AuthModule } from 'src/auth/auth.module';
import { DatabaseService } from 'src/database/database.service';
import { EmailService } from 'src/email/email.service'; // <= важно
import { SessionModule } from 'src/session/session.module';
import { UserModule } from 'src/user/user.module';
import request from 'supertest';

describe('AuthController (e2e)', () => {
	let app: INestApplication;
	let databaseService: DatabaseService;
	let emailConfirmToken: string;

	const userData = {
		email: 'test@email.com',
		password: 'Password1',
		name: 'Test User',
	};

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [
				AuthModule,
				SessionModule,
				UserModule,
				ConfigModule.forRoot({ isGlobal: true }),
				JwtModule.register({
					secret: process.env.JWT_SECRET || 'test',
					signOptions: { expiresIn: '5m' },
				}),
			],
		})
			.overrideProvider(EmailService)
			.useValue({
				sendEmail: jest
					.fn()
					.mockImplementation(
						(obj: {
							templateVariables: { verificationUrl: string };
						}) => {
							const url = new URL(
								obj.templateVariables.verificationUrl,
							);
							emailConfirmToken = url.searchParams.get('token')!;
						},
					),
			})
			.compile();

		app = moduleRef.createNestApplication();
		databaseService = app.get(DatabaseService);

		app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
		app.use(cookieParser());
		await app.init();

		await databaseService.user.deleteMany({
			where: { email: userData.email },
		});
	});

	afterAll(async () => {
		await app.close();
	});

	it('should registers user', async () => {
		await request(app.getHttpServer())
			.post('/auth/register')
			.send(userData)
			.expect(201);
	});

	it('should verify email', async () => {
		const user = await databaseService.user.findUnique({
			where: { email: userData.email },
		});
		expect(user).toBeDefined();
		await request(app.getHttpServer())
			.post(`/auth/verify-email?token=${emailConfirmToken}`)
			.send()
			.expect(201);
	});

	it('should login and checks auth', async () => {
		const loginRes = await request(app.getHttpServer())
			.post('/auth/login')
			.send({ email: userData.email, password: userData.password })
			.expect(200);

		const cookies = loginRes.get('Set-Cookie') as string[];
		expect(cookies).toBeDefined();

		await request(app.getHttpServer())
			.get('/auth/is-auth')
			.set('Cookie', cookies)
			.expect(200);
	});

	it('401 without token', async () => {
		await request(app.getHttpServer()).get('/auth/is-auth').expect(401);
	});
});
