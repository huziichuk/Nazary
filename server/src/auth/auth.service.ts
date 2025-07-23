import {
	BadRequestException,
	ForbiddenException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcryptjs from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import ms, { StringValue } from 'ms';
import { nanoid } from 'nanoid';
import AUTH_MESSAGES from '../constants/auth.messages';
import CONFIG_CONSTANTS from '../constants/config.constants';
import { EmailService } from '../email/email.service';
import { SessionService } from '../session/session.service';
import { EmailTemplateEnum } from '../types/general.types';
import { UserService } from '../user/user.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService,
		private readonly sessionService: SessionService,
		private readonly emailService: EmailService,
	) {}

	async register(dto: RegisterDto) {
		const existingUser = await this.userService.findByEmail(dto.email);
		if (existingUser) {
			throw new BadRequestException(
				AUTH_MESSAGES.ERROR.USER_ALREADY_EXISTS,
			);
		}
		const hashedPassword = bcryptjs.hashSync(dto.password, 10);
		const user = await this.userService.create({
			...dto,
			password: hashedPassword,
		});

		await this.emailService.sendEmail({
			to: user.email,
			subject: 'Confirm your email',
			template: EmailTemplateEnum.confirmEmail,
			templateVariables: {
				userName: dto.name.length === 0 ? dto.email : dto.name,
				verificationUrl: `${this.configService.get<string>(
					'CLIENT_URL',
				)}/verify-email?token=${user.confirmToken}`,
			},
		});

		return user;
	}

	async login(dto: LoginDto) {
		const user = await this.userService.findByEmail(dto.email);
		if (!user) {
			throw new UnauthorizedException(AUTH_MESSAGES.ERROR.USER_NOT_FOUND);
		}

		if (!bcryptjs.compareSync(dto.password, user.password)) {
			throw new UnauthorizedException(AUTH_MESSAGES.ERROR.WRONG_PASSWORD);
		}

		if (!user.isConfirmed) {
			throw new ForbiddenException(
				AUTH_MESSAGES.ERROR.EMAIL_NOT_CONFIRMED,
			);
		}

		const token = nanoid(64);

		const session = await this.sessionService.create({
			userId: user.id,
			token,
			expiresAt: new Date(
				Date.now() +
					ms(
						this.configService.get<StringValue>(
							CONFIG_CONSTANTS.JWT_REFRESH_EXPIRES_IN,
						) || '30d',
					),
			),
		});

		return this.generateTokens({
			userId: user.id,
			token,
			sessionId: session.id,
		});
	}

	async resendVerification(email: string) {
		const user = await this.userService.findByEmail(email);
		if (!user) {
			throw new BadRequestException(AUTH_MESSAGES.ERROR.USER_NOT_FOUND);
		}

		if (user.isConfirmed) {
			throw new BadRequestException(
				AUTH_MESSAGES.ERROR.ALREADY_CONFIRMED,
			);
		}

		await this.emailService.sendEmail({
			to: user.email,
			subject: 'Confirm your email',
			template: EmailTemplateEnum.confirmEmail,
			templateVariables: {
				userName: user.name ? user.name : user.email,
				verificationUrl: `${this.configService.get<string>(
					'CLIENT_URL',
				)}/verify-email?token=${user.confirmToken}`,
			},
		});

		return { message: AUTH_MESSAGES.SUCCESS.VERIFICATION_EMAIL_SENT };
	}

	async verifyEmail(token: string) {
		const user = await this.userService.findByConfirmToken(token);
		if (!user) {
			throw new BadRequestException(
				AUTH_MESSAGES.ERROR.INVALID_OR_EXPIRED_TOKEN,
			);
		}

		if (user.isConfirmed) {
			throw new BadRequestException(
				AUTH_MESSAGES.ERROR.ALREADY_CONFIRMED,
			);
		}

		user.isConfirmed = true;
		user.confirmToken = null;

		await this.userService.update(user);
	}

	generateAccessToken(id: string) {
		return this.jwtService.sign({ id });
	}

	generateRefreshToken({
		userId,
		sessionId,
		token,
	}: {
		userId: string;
		sessionId: string;
		token: string;
	}) {
		return jwt.sign(
			{
				userId,
				token,
				sessionId,
			},
			this.configService.get(CONFIG_CONSTANTS.JWT_REFRESH_SECRET) ||
				'JWT_REFRESH_SECRET',
			{
				expiresIn: this.configService.get(
					CONFIG_CONSTANTS.JWT_REFRESH_EXPIRES_IN,
				),
			},
		);
	}

	generateTokens({
		userId,
		sessionId,
		token,
	}: {
		userId: string;
		sessionId: string;
		token: string;
	}): {
		accessToken: string;
		refreshToken: string;
	} {
		return {
			accessToken: this.generateAccessToken(userId),
			refreshToken: this.generateRefreshToken({
				userId,
				sessionId,
				token,
			}),
		};
	}
}
