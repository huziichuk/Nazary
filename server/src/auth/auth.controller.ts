import {
	BadRequestException,
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Post,
	Query,
	Req,
	Res,
	UseGuards,
	ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
	ApiBadRequestResponse,
	ApiOkResponse,
	ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Response } from 'express';
import AUTH_MESSAGES from '../constants/auth.messages';
import GENERAL_MESSAGES from '../constants/general.messages';
import { SessionService } from '../session/session.service';
import { AuthRequest } from '../types/request.types';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import {
	LoginDto,
	RegisterDto,
	RequestPasswordResetDto,
	ResetPasswordDto,
	VerifyPasswordResetDto,
} from './dto/auth.dto';

@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly configService: ConfigService,
		private readonly sessionService: SessionService,
	) {}

	@ApiOkResponse({ description: AUTH_MESSAGES.SUCCESS.REGISTERED })
	@ApiBadRequestResponse({
		description: AUTH_MESSAGES.ERROR.USER_ALREADY_EXISTS,
	})
	@ApiBadRequestResponse({ description: GENERAL_MESSAGES.ERROR.VALIDATION })
	@Post('register')
	@HttpCode(HttpStatus.CREATED)
	async register(@Body(new ValidationPipe()) dto: RegisterDto) {
		await this.authService.register(dto);
		return { message: AUTH_MESSAGES.SUCCESS.REGISTERED };
	}

	@ApiOkResponse({ description: AUTH_MESSAGES.SUCCESS.LOGGED_IN })
	@ApiBadRequestResponse({ description: AUTH_MESSAGES.ERROR.USER_NOT_FOUND })
	@ApiBadRequestResponse({ description: AUTH_MESSAGES.ERROR.WRONG_PASSWORD })
	@ApiBadRequestResponse({ description: GENERAL_MESSAGES.ERROR.VALIDATION })
	@Post('login')
	async login(
		@Body(new ValidationPipe()) dto: LoginDto,
		@Res() res: Response,
	) {
		const { accessToken, refreshToken, salt } =
			await this.authService.login(dto);

		res.cookie('accessToken', accessToken, {
			httpOnly: true,
			secure: false,
			sameSite: 'lax',
			/*maxAge: ms(
				this.configService.get<StringValue>(
					CONFIG_CONSTANTS.JWT_ACCESS_EXPIRES_IN,
				) ?? '10m',
			), */
		});
		res.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			secure: false,
			sameSite: 'lax',
			/*maxAge: ms(
				this.configService.get<StringValue>(
					CONFIG_CONSTANTS.JWT_REFRESH_EXPIRES_IN,
				) ?? '30d',
			), */
		});

		res.status(200).json({
			message: AUTH_MESSAGES.SUCCESS.LOGGED_IN,
			salt,
		});
	}

	@UseGuards(AuthGuard)
	@Get('salt')
	getSalt(@Req() req: AuthRequest) {
		return {
			salt: req.user.salt,
		};
	}

	@ApiOkResponse({ description: AUTH_MESSAGES.SUCCESS.AUTHORIZED })
	@ApiUnauthorizedResponse({ description: AUTH_MESSAGES.ERROR.UNAUTHORIZED })
	@UseGuards(AuthGuard)
	@Get('is-auth')
	isAuth(@Req() req: AuthRequest) {
		return {
			id: req.user.id,
			email: req.user.email,
			createdAt: req.user.createdAt,
			salt: req.user.salt,
			name: req.user.name ? req.user.name : req.user.email,
		};
	}

	@ApiOkResponse({ description: AUTH_MESSAGES.SUCCESS.LOGOUT })
	@ApiUnauthorizedResponse({ description: AUTH_MESSAGES.ERROR.UNAUTHORIZED })
	@UseGuards(AuthGuard)
	@Post('logout')
	async logout(@Res() res: Response, @Req() req: AuthRequest) {
		res.clearCookie('accessToken');
		res.clearCookie('refreshToken');
		console.log(req.sessionId);
		await this.sessionService.delete(req.sessionId);
		res.status(200).json({ message: AUTH_MESSAGES.SUCCESS.LOGOUT });
	}

	@Post('verify-email')
	async verifyEmail(@Query('token') token: string) {
		if (!token) {
			throw new BadRequestException(
				AUTH_MESSAGES.ERROR.INVALID_OR_EXPIRED_TOKEN,
			);
		}
		await this.authService.verifyEmail(token.trim());
		return {
			message: AUTH_MESSAGES.SUCCESS.EMAIL_CONFIRMED,
		};
	}

	@Post('resend-verification')
	async resendVerification(@Body('email') email: string) {
		if (!email) {
			throw new BadRequestException(
				AUTH_MESSAGES.ERROR.EMAIL_IS_REQUIRED,
			);
		}
		await this.authService.resendVerification(email.trim());
		return {
			message: AUTH_MESSAGES.SUCCESS.VERIFICATION_EMAIL_SENT,
		};
	}

	@Post('request-password-reset')
	async requestPasswordReset(
		@Body(new ValidationPipe()) dto: RequestPasswordResetDto,
	) {
		await this.authService.requestPasswordReset(dto);
		return {
			message: AUTH_MESSAGES.SUCCESS.REQUEST_PASSWORD_RESET,
		};
	}

	@Post('verify-password-reset')
	async verifyPasswordReset(
		@Body(new ValidationPipe()) dto: VerifyPasswordResetDto,
	) {
		await this.authService.verifyPasswordReset(dto);
		return {
			message: AUTH_MESSAGES.SUCCESS.TOKEN_IS_OK,
		};
	}

	@Post('password-reset')
	async passwordReset(@Body(new ValidationPipe()) dto: ResetPasswordDto) {
		await this.authService.resetPassword(dto);
		return {
			message: AUTH_MESSAGES.SUCCESS.PASSWORD_CHANGED,
		};
	}
}
