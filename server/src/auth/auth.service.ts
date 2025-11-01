import {
	BadRequestException,
	ForbiddenException,
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CodeType, User } from '@prisma/client';
import * as jwt from 'jsonwebtoken';
import ms, { StringValue } from 'ms';
import { nanoid } from 'nanoid';
import AUTH_MESSAGES from '../constants/auth.messages';
import CONFIG_CONSTANTS from '../constants/config.constants';
import { EmailService } from '../email/email.service';
import { SessionService } from '../session/session.service';
import { EmailTemplateEnum } from '../types/general.types';
import { UserService } from '../user/user.service';
import { EncryptionService } from './../encryption/encryption.service';
import { VerificationCodeService } from './../verification-code/verification-code.service';
import {
	LoginDto,
	RegisterDto,
	RequestPasswordResetDto,
	ResetPasswordDto,
	VerifyPasswordResetDto,
} from './dto/auth.dto';

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService,
		private readonly sessionService: SessionService,
		private readonly emailService: EmailService,
		private readonly encryptionService: EncryptionService,
		private readonly verificationCodeService: VerificationCodeService,
	) {}

	async register(dto: RegisterDto) {
		const existingUser = await this.userService.findByEmail(dto.email);
		if (existingUser) {
			throw new BadRequestException(
				AUTH_MESSAGES.ERROR.USER_ALREADY_EXISTS,
			);
		}

		const confirmToken = nanoid(64);
		const user = await this.userService.create({
			...dto,
			password: await this.encryptionService.hashPassword(dto.password),
			confirmToken: this.encryptionService.sha256(confirmToken),
		});

		await this.emailService.sendEmail({
			to: user.email,
			subject: 'Confirm your email',
			template: EmailTemplateEnum.confirmEmail,
			templateVariables: {
				userName: dto.name.length === 0 ? dto.email : dto.name,
				verificationUrl: `${this.configService.get<string>(
					'CLIENT_URL',
				)}/verify-email?token=${confirmToken}`,
			},
		});

		return user;
	}

	async login(dto: LoginDto) {
		const user = await this.userService.findByEmail(dto.email);
		if (!user) {
			throw new UnauthorizedException(AUTH_MESSAGES.ERROR.USER_NOT_FOUND);
		}

		if (
			(await this.encryptionService.comparePassword(
				dto.password,
				user.password,
			)) === false
		) {
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

		return {
			...this.generateTokens({
				user,
				token,
				sessionId: session.id,
			}),
			salt: user.salt,
		};
	}

	async resetPassword(dto: ResetPasswordDto) {
		const codeObject = await this.verifyPasswordReset({ code: dto.code });

		const user = await this.userService.findById(codeObject.userId);

		if (!user)
			throw new BadRequestException(AUTH_MESSAGES.ERROR.USER_NOT_FOUND);

		user.password = await this.encryptionService.hashPassword(
			dto.newPassword,
		);

		await this.userService.update(user);

		await this.verificationCodeService.deleteVerificationCode(
			codeObject.id,
		);

		await this.sessionService.deleteAll(user.id);

		await this.emailService.sendEmail({
			to: user.email,
			subject: 'Password changed',
			template: EmailTemplateEnum.passwordChanged,
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
	}

	async verifyEmail(token: string) {
		const encryptedToken = this.encryptionService.sha256(token);
		const user = await this.userService.findByConfirmToken(encryptedToken);
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

	async requestPasswordReset(dto: RequestPasswordResetDto) {
		const user = await this.userService.findByEmail(dto.email);
		if (!user)
			throw new NotFoundException(AUTH_MESSAGES.ERROR.USER_NOT_FOUND);
		if (!user.isConfirmed)
			throw new ForbiddenException(
				AUTH_MESSAGES.ERROR.EMAIL_NOT_CONFIRMED,
			);

		const code = this.encryptionService.generate6DigitCode();

		await this.emailService.sendEmail({
			to: user.email,
			subject: 'Reset Password',
			template: EmailTemplateEnum.resetPassword,
			templateVariables: {
				userName: user.name ? user.name : user.email,
				resetCode: code,
			},
		});

		await this.verificationCodeService.createVerificationCode({
			userId: user.id,
			type: CodeType.PASSWORD_RESET,
			code: code,
		});
	}

	async verifyPasswordReset(dto: VerifyPasswordResetDto) {
		const codeDataObject =
			await this.verificationCodeService.getVerificationCode(dto.code);
		if (!codeDataObject)
			throw new BadRequestException(AUTH_MESSAGES.ERROR.INVALID_CODE);

		if (codeDataObject.type !== CodeType.PASSWORD_RESET)
			throw new BadRequestException(AUTH_MESSAGES.ERROR.INVALID_CODE);

		if (codeDataObject.expiresAt < new Date()) {
			await this.verificationCodeService.deleteVerificationCode(
				codeDataObject.id,
			);
			throw new BadRequestException(AUTH_MESSAGES.ERROR.INVALID_CODE);
		}

		return codeDataObject;
	}

	generateAccessToken(user: User, sessionId: string) {
		return jwt.sign(
			{
				id: user.id,
				email: user.email,
				name: user.name,
				createdAt: user.createdAt,
				salt: user.salt,
				sessionId: sessionId,
			},
			this.configService.get<string>(
				CONFIG_CONSTANTS.JWT_ACCESS_SECRET,
			) || 'JWT_ACCESS_SECRET',
			{
				expiresIn: this.configService.get(
					CONFIG_CONSTANTS.JWT_ACCESS_EXPIRES_IN,
				),
			},
		);
	}

	generateRefreshToken({
		user,
		sessionId,
		token,
	}: {
		user: User;
		sessionId: string;
		token: string;
	}) {
		return jwt.sign(
			{
				id: user.id,
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
		user,
		sessionId,
		token,
	}: {
		user: User;
		sessionId: string;
		token: string;
	}): {
		accessToken: string;
		refreshToken: string;
	} {
		return {
			accessToken: this.generateAccessToken(user, sessionId),
			refreshToken: this.generateRefreshToken({
				user,
				sessionId,
				token,
			}),
		};
	}
}
